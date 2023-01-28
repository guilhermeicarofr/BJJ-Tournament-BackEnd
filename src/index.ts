import express from 'express';
import cors from 'cors';

import { loadEnv } from './setup-envs';
import { authRouter } from 'routers/auth-router';
import { lastErrorCatch, validateAuthToken } from 'middlewares/validation-middlewares';
import { eventsRouter } from 'routers/events-router';

loadEnv();
const PORT = process.env.PORT || 5000;

const server = express();
server.use(cors());
server.use(express.json());

/* eslint-disable-next-line no-console */
server.get('/health', () => console.log('ok'));

server.use('/auth', authRouter);
server.use('/events', eventsRouter);
//server.use(validateAuthToken);
server.use(lastErrorCatch);

/* eslint-disable-next-line no-console */
server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
export { server };
