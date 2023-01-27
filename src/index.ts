import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

import { authRouter } from 'routers/auth-router';
import { lastErrorCatch, validateAuthToken } from 'middlewares/validation-middlewares';

config();
const server = express();
server.use(cors());
server.use(express.json());
server.get('/health', () => console.log('ok'));

server.use('/auth', authRouter);
server.use(validateAuthToken);
//server.use('/events', eventsRouter);

server.use(lastErrorCatch);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
