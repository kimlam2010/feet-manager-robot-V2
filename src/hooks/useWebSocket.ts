import { useEffect, useRef, useState, useCallback } from 'react';
import { logger } from '../utils/logger';

interface WebSocketData {
  type: string;
  payload: Record<string, unknown>;
}

interface UseWebSocketOptions {
  onMessage?: (data: WebSocketData) => void;
  onError?: (error: Event) => void;
  onClose?: () => void;
  onOpen?: () => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export const useWebSocket = (url: string, options: UseWebSocketOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Event | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = options.reconnectAttempts ?? 3;
  const reconnectInterval = options.reconnectInterval ?? 3000;

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        options.onOpen?.();
      };

      ws.onclose = () => {
        setIsConnected(false);
        options.onClose?.();
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (event: Event) => {
        setError(event);
        options.onError?.(event);
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data) as WebSocketData;
          options.onMessage?.(data);
        } catch (error) {
          logger.error('Failed to parse WebSocket message:', error);
        }
      };
    } catch (error) {
      logger.error('Failed to connect to WebSocket:', error);
    }
  }, [url, maxReconnectAttempts, reconnectInterval, options]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    error,
  };
};
