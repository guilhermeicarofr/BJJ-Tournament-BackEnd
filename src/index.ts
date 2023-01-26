import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

import { authRouter } from 'routers/auth-router';

config();
const server = express();
server.use(cors());
server.use(express.json());

server.get('/health', () => console.log('ok'));

server.use('/auth', authRouter);
//server.use('/events', eventsRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
