import express from "express";
import cors from 'cors';
import { config } from 'dotenv';
config();

const PORT = process.env.PORT || 5000;

import athleteControllers from './controllers/athlete.controllers.js';
import { validateSchema } from './middlewares/validation.middlewares.js';
import { athleteInputSchema } from './schemas/schemas.js';
import { listAbsolute, listTournament } from './controllers/tournament.controllers.js';

const server = express();
server.use(cors());
server.use(express.json());

server.get('/health', (req, res) => console.log('running'));

//server.get('/athletes', athleteControllers.readAll);
// server.post('/athletes', validateSchema(athleteInputSchema), athleteControllers.createOne);
// server.put('/athletes/:id', validateSchema(athleteInputSchema), athleteControllers.updateOne);
// server.delete('/athletes/:id', athleteControllers.removeOne);

// server.get('/tournament/:belt/:age/:weight', listTournament);
// server.get('/tournament/:belt/absolute', listAbsolute);

server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));