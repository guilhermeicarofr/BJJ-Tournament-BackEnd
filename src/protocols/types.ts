import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

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
};

export type SignInData = {
  email: string;
  password: string;
};

export type FilterQuery = {
  filter: 'open' | 'closed' | 'finished'
};

type Auth = { auth: 
  {
    userId: number;
  };
};
export type AuthRequest = Request & Auth;

export type TournamentClasses = {
  belts: {
    id: number;
    name: string;
  }[];
  ageClasses: {
    id: number;
    name: string;
    min: number;
    max: number;
  }[];
	weigthClasses: {
    male: {
      id: number;
      name: string;
      min: number;
      max: number;
    }[];
    female: {
      id: number;
      name: string;
      min: number;
      max: number;
    }[];
  };
}
