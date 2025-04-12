export const SYSTEM_LIMITS = {
  MAX_WORKSETS: 10,
  MAX_ROBOTS: 100,
  PAGE_LOAD_TIME: 3000, // 3 seconds
  RENDER_TIME: 1000, // 1 second
  MAX_MEMORY_USAGE: 100, // 100MB
  MAX_NETWORK_REQUESTS: 50, // per minute
  MIN_WEBSOCKET_STABILITY: 99.9, // 99.9%
};

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  ROBOTS: '/api/robots',
  WORKSETS: '/api/worksets',
};

export const WEBSOCKET_CONFIG = {
  RECONNECT_INTERVAL: 1000,
  MAX_RETRIES: 5,
};

export const GRPC_CONFIG = {
  HOST: process.env.GRPC_HOST || 'localhost',
  PORT: process.env.GRPC_PORT || '50051',
};

export const MQTT_CONFIG = {
  HOST: process.env.MQTT_HOST || 'localhost',
  PORT: process.env.MQTT_PORT || '1883',
  TOPICS: {
    ROBOT_STATUS: 'robot/status',
    ROBOT_COMMAND: 'robot/command',
    WORKSET_STATUS: 'workset/status',
  },
};
