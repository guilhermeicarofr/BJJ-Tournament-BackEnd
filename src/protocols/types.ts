import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { finished } from 'stream';

export type ApplicationError = {
  name: string;
  message: string;
};

export type AuthenticatedRequest = Request & JwtPayload;

export type ValidatedAuthToken = {
  userId: number;
  userName: string;
};

export type SignUpData = {
  name: string;
  cpf: string;
  email: string;
  password: string;
}

export type SignInData = {
  email: string;
  password: string;
}

export type FilterQuery = {
  filter: 'open' | 'closed' | 'finished'
}
