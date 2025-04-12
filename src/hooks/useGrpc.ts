import { useEffect, useRef, useCallback, useState } from 'react';
import { Client, ClientReadableStream, ServiceError } from '@grpc/grpc-js';     

interface GrpcHook<T> {
  isConnected: boolean;
  call: (request: any) => Promise<T>;
  stream: (request: any, onData: (data: T) => void) => void;
  error: Error | null;
}

type GrpcMethod = (request: any, callback: (error: ServiceError | null, response: any) => void) => void;
type GrpcStreamMethod = (request: any) => ClientReadableStream<any>;

interface GrpcClient extends Client {
  [key: string]: GrpcMethod | GrpcStreamMethod | any;
}

export const useGrpc = <T>(client: GrpcClient, methodName: string): GrpcHook<T> => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const streamRef = useRef<ClientReadableStream<T> | null>(null);

  const connect = useCallback(async () => {
    try {
      await new Promise<void>((resolve, reject) => {
        client.waitForReady(Date.now() + 5000, (error?: Error) => {
          if (error) reject(error);
          else resolve();
        });
      });
      setIsConnected(true);
      setError(null);
    } catch (err) {
      setIsConnected(false);
      setError(err instanceof Error ? err : new Error('Failed to connect to gRPC server'));
    }
  }, [client]);

  useEffect(() => {
    connect();

    return () => {
      if (streamRef.current) {
        streamRef.current.cancel();
      }
    };
  }, [connect]);

  const call = useCallback(async (request: any): Promise<T> => {
    if (!isConnected) {
      throw new Error('gRPC client is not connected');
    }

    const method = client[methodName] as GrpcMethod;
    if (!method) {
      throw new Error(`Method ${methodName} not found on client`);
    }

    return new Promise((resolve, reject) => {
      method(request, (err: ServiceError | null, response: T) => {
        if (err) {
          setError(err);
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }, [client, methodName, isConnected]);

  const stream = useCallback((request: any, onData: (data: T) => void) => {
    if (!isConnected) {
      setError(new Error('gRPC client is not connected'));
      return;
    }

    const method = client[methodName] as GrpcStreamMethod;
    if (!method) {
      setError(new Error(`Method ${methodName} not found on client`));
      return;
    }

    if (streamRef.current) {
      streamRef.current.cancel();
    }

    const stream = method(request) as ClientReadableStream<T>;
    if (!stream) {
      setError(new Error(`Failed to create stream for method ${methodName}`));
      return;
    }

    streamRef.current = stream;
    stream.on('data', onData);
    stream.on('error', (err: ServiceError) => {
      setError(err);
    });
    stream.on('end', () => {
      streamRef.current = null;
    });
  }, [client, methodName, isConnected]);

  return {
    isConnected,
    call,
    stream,
    error
  };
}; 