import { DefaultSession } from 'next-auth';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession['user'];
  }

  interface User {
    role: UserRole;
  }
} 