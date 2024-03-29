import httpStatus from 'http-status';
import { Schema } from 'joi';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

import { errors } from 'errors/errors';
import { AuthenticatedRequest, ValidatedAuthToken } from 'protocols/types';
import { userIdCheck } from 'services/auth-services';

export function validateSchema(schema: Schema, type: 'body' | 'params' | 'query') {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate(req[type], { abortEarly: false });
    if(validation.error) {
      return res.status(httpStatus.BAD_REQUEST).send(validation.error.details.map((detail) => detail.message));
    }
    next();
  };
}

export async function validateAuthToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) throw errors.signInError();
  
    const token = authHeader.split(' ')[1];
    if (!token) throw errors.signInError();

    const SECRET = process.env.JWT_SECRET;
    const verified = jwt.verify(token, SECRET) as ValidatedAuthToken;

    if (verified.userId === undefined) throw errors.signInError();

    await userIdCheck(verified.userId);
    
    req.auth = { userId: verified.userId };
    return next();
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send(error.message);
  }
}

export async function lastErrorCatch(req: Request, res: Response) {
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
}
