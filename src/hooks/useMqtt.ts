import { useEffect, useRef, useCallback, useState } from 'react';
import mqtt, { MqttClient, IClientOptions } from 'mqtt';

interface MqttMessage {
  topic: string;
  message: string;
}

interface MqttHook {
  isConnected: boolean;
  publish: (topic: string, message: string) => void;
  subscribe: (topic: string, callback: (message: MqttMessage) => void) => void;
  unsubscribe: (topic: string) => void;
  error: Error | null;
}

export const useMqtt = (brokerUrl: string, options?: IClientOptions): MqttHook => {
  const clientRef = useRef<MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionsRef = useRef<Map<string, (message: MqttMessage) => void>>(new Map());

  const connect = useCallback(() => {
    try {
      clientRef.current = mqtt.connect(brokerUrl, options);

      clientRef.current.on('connect', () => {
        setIsConnected(true);
        setError(null);
      });

      clientRef.current.on('error', (err) => {
        setError(err);
        setIsConnected(false);
      });

      clientRef.current.on('message', (topic, message) => {
        const callback = subscriptionsRef.current.get(topic);
        if (callback) {
          callback({
            topic,
            message: message.toString()
          });
        }
      });

      clientRef.current.on('close', () => {
        setIsConnected(false);
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create MQTT client'));
    }
  }, [brokerUrl, options]);

  useEffect(() => {
    connect();

    return () => {
      if (clientRef.current) {
        clientRef.current.end();
      }
    };
  }, [connect]);

  const publish = useCallback((topic: string, message: string) => {
    if (!clientRef.current || !isConnected) {
      setError(new Error('MQTT client is not connected'));
      return;
    }

    clientRef.current.publish(topic, message);
  }, [isConnected]);

  const subscribe = useCallback((topic: string, callback: (message: MqttMessage) => void) => {
    if (!clientRef.current || !isConnected) {
      setError(new Error('MQTT client is not connected'));
      return;
    }

    clientRef.current.subscribe(topic);
    subscriptionsRef.current.set(topic, callback);
  }, [isConnected]);

  const unsubscribe = useCallback((topic: string) => {
    if (!clientRef.current || !isConnected) {
      setError(new Error('MQTT client is not connected'));
      return;
    }

    clientRef.current.unsubscribe(topic);
    subscriptionsRef.current.delete(topic);
  }, [isConnected]);

  return {
    isConnected,
    publish,
    subscribe,
    unsubscribe,
    error
  };
}; 