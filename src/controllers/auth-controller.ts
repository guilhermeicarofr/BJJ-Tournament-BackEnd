import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';

import { SignInData, SignUpData } from 'protocols/types';
import { registerNewUser, signInUser } from 'services/auth-services';

export async function signUp(req: Request, res: Response, next: NextFunction) {
  const { name, cpf, email, password } = req.body as SignUpData;

  try {
    await registerNewUser({ name, cpf, email, password });
    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    if(error.name === 'InvalidSignUp') return res.status(httpStatus.FORBIDDEN).send(error.message);
    return next();
  }
}

export async function signIn(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body as SignInData;

  try {
    const token = await signInUser({ email, password });
    return res.status(httpStatus.OK).send(token);
  } catch (error) {
    if(error.name === 'InvalidSignIn') return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    return next();
  }
}
