import express, { Request, Response } from 'express';
import cors from 'cors';
import httpStatus from 'http-status';

import { loadEnv } from './setup-envs';
import { authRouter } from 'routers/auth-router';
import { lastErrorCatch } from 'middlewares/validation-middlewares';
import { eventsRouter } from 'routers/events-router';
import { creatorRouter } from 'routers/creator-router';

loadEnv();
const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV;

const server = express();
server.use(cors());
server.use(express.json());

server.get('/health', (req: Request, res: Response) => { 
  /* eslint-disable-next-line no-console */
  console.log('OK');
  return res.sendStatus(httpStatus.OK).send('OK');
});

server
  .use('/auth', authRouter)
  .use('/events', eventsRouter)
  .use('/creator', creatorRouter)
  .use(lastErrorCatch);

if(ENV !== 'test') {
  /* eslint-disable-next-line no-console */
  server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
}

export { server };
