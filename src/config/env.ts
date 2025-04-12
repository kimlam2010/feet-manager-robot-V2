interface Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  API_URL: string;
  WEBSOCKET_URL: string;
  GRPC_HOST: string;
  GRPC_PORT: string;
  MQTT_HOST: string;
  MQTT_PORT: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
}

export const env: Environment = {
  NODE_ENV: (process.env.NODE_ENV as Environment['NODE_ENV']) || 'development',
  API_URL: process.env.API_URL || 'http://localhost:3000',
  WEBSOCKET_URL: process.env.WEBSOCKET_URL || 'ws://localhost:3000',
  GRPC_HOST: process.env.GRPC_HOST || 'localhost',
  GRPC_PORT: process.env.GRPC_PORT || '50051',
  MQTT_HOST: process.env.MQTT_HOST || 'localhost',
  MQTT_PORT: process.env.MQTT_PORT || '1883',
  DATABASE_URL:
    process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/feet_manager_robot',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
};
