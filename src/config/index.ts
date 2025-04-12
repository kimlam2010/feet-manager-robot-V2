export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
  },
  websocket: {
    url: process.env.NEXT_PUBLIC_WS_URL,
    reconnectInterval: 3000,
    maxRetries: 5,
  },
  grpc: {
    url: process.env.NEXT_PUBLIC_GRPC_URL,
    credentials: 'insecure',
  },
  mqtt: {
    url: process.env.NEXT_PUBLIC_MQTT_URL,
    options: {
      username: process.env.NEXT_PUBLIC_MQTT_USER,
      password: process.env.NEXT_PUBLIC_MQTT_PASS,
      keepalive: 60,
      reconnectPeriod: 1000,
    },
  },
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    expiresInKey: 'expires_in',
  },
  system: {
    maxWorksets: 10,
    maxRobots: 100,
    maxRequestsPerMinute: 50,
    wsStabilityThreshold: 0.999,
  },
}; 