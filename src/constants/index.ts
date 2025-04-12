export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  ROBOT: {
    LIST: '/robots',
    DETAIL: '/robots/:id',
    CREATE: '/robots',
    UPDATE: '/robots/:id',
    DELETE: '/robots/:id',
    STATUS: '/robots/:id/status',
    CONTROL: '/robots/:id/control',
  },
  WORKSET: {
    LIST: '/worksets',
    DETAIL: '/worksets/:id',
    CREATE: '/worksets',
    UPDATE: '/worksets/:id',
    DELETE: '/worksets/:id',
    ASSIGN: '/worksets/:id/assign',
    SCHEDULE: '/worksets/:id/schedule',
  },
};

export const WEBSOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  ROBOT_STATUS: 'robot:status',
  ROBOT_CONTROL: 'robot:control',
  WORKSET_STATUS: 'workset:status',
  WORKSET_UPDATE: 'workset:update',
};

export const MQTT_TOPICS = {
  ROBOT_STATUS: 'robot/+/status',
  ROBOT_CONTROL: 'robot/+/control',
  WORKSET_STATUS: 'workset/+/status',
  WORKSET_UPDATE: 'workset/+/update',
};

export const ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  INTERNAL_SERVER_ERROR: 500,
};
