import { event } from '@prisma/client';
import joi, { Schema } from 'joi';
import { SignInData, SignUpData } from 'protocols/types';

const signUp: Schema<SignUpData>= joi.object({
  name: joi.string().required().max(250).trim(),
  cpf: joi.string().length(11).required(),
  email: joi.string().email().required().max(100).trim(),
  password: joi.string().required().max(50).min(4).trim(),
});

const signIn: Schema<SignInData> = joi.object({
  email: joi.string().email().required().max(100).trim(),
  password: joi.string().required().max(50).min(4).trim(),
});

const newEvent: Schema<Partial<event>> = joi.object({
  name: joi.string().required().max(250).trim(),
  date: joi.date().required(),
  price: joi.number().min(0).required(),
  description: joi.string().required(),
  absolute: joi.boolean(),
});

const idParam = (idName: string) => {
  return joi.object({
    [idName]: joi.number().integer().min(1).required()
  });
};

const schemas = {
  signUp,
  signIn,
  idParam,
  newEvent,
};

export { schemas };
