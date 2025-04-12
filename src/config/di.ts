import { Container, injectable } from 'inversify';
import 'reflect-metadata';

const container = new Container();

// Service identifiers
export const TYPES = {
  AuthService: Symbol.for('AuthService'),
  RobotService: Symbol.for('RobotService'),
  WorksetService: Symbol.for('WorksetService'),
  WebSocketService: Symbol.for('WebSocketService'),
  GrpcService: Symbol.for('GrpcService'),
  MqttService: Symbol.for('MqttService'),
  DatabaseService: Symbol.for('DatabaseService'),
  LoggerService: Symbol.for('LoggerService'),
  ErrorHandler: Symbol.for('ErrorHandler'),
};

// Service registration function
export function bindService<T>(
  serviceIdentifier: symbol | string,
  implementation: new (...args: any[]) => T
): void {
  container.bind<T>(serviceIdentifier).to(implementation);
}

// Get service instance
export function getService<T>(serviceIdentifier: symbol | string): T {
  return container.get<T>(serviceIdentifier);
}

export { injectable };
export default container;
