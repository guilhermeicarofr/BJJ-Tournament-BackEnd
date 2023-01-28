import express from 'express';

import { validateSchema } from 'middlewares/validation-middlewares';
import { signUp, signIn } from 'controllers/auth-controller';
import { schemas } from 'schemas/schemas';

const authRouter = express.Router();

authRouter
  .post('/signup', validateSchema(schemas.signUp, 'body'), signUp)
  .post('/signin', validateSchema(schemas.signIn, 'body'), signIn);

export { authRouter };
