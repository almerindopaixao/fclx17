import { Request } from 'express';

export interface User {
  sub: number;
  username: string;
}

export interface AuthRequest extends Request {
  user: User;
}
