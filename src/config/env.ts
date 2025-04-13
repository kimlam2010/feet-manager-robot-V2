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
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  ENABLE_ERROR_REPORTING: boolean;
}

export const env: Environment = {
  NODE_ENV: (process.env.NODE_ENV as Environment['NODE_ENV']) || 'development',
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  WEBSOCKET_URL: process.env.REACT_APP_WS_URL || 'ws://localhost:3001',
  GRPC_HOST: process.env.REACT_APP_GRPC_URL || 'http://localhost:3002',
  GRPC_PORT: process.env.REACT_APP_GRPC_PORT || '50051',
  MQTT_HOST: process.env.REACT_APP_MQTT_URL || 'mqtt://localhost:1883',
  MQTT_PORT: process.env.REACT_APP_MQTT_PORT || '1883',
  DATABASE_URL:
    process.env.REACT_APP_DB_URL || 'postgresql://postgres:postgres@localhost:5432/feet_manager_robot',
  JWT_SECRET: process.env.REACT_APP_JWT_SECRET || 'your-secret-key',
  LOG_LEVEL: (process.env.REACT_APP_LOG_LEVEL as Environment['LOG_LEVEL']) || 'info',
  ENABLE_ERROR_REPORTING: process.env.REACT_APP_ENABLE_ERROR_REPORTING === 'true' || false,
};
