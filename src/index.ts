import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
config();

const PORT = process.env.PORT || 5000;

const server = express();
server.use(cors());
server.use(express.json());

server.get('/health', () => console.log('ok'));

// server.get('/athletes', athleteControllers.readAll);
// server.post('/athletes', validateSchema(athleteInputSchema), athleteControllers.createOne);
// server.put('/athletes/:id', validateSchema(athleteInputSchema), athleteControllers.updateOne);
// server.delete('/athletes/:id', athleteControllers.removeOne);

// server.get('/tournament/:belt/:age/:weight', listTournament);
// server.get('/tournament/:belt/absolute', listAbsolute);

server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
