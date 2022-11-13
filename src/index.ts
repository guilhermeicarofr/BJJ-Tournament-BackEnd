import express from "express";
import { config } from 'dotenv';
config();

import athleteControllers from './controllers/athlete.controllers.js';


const server = express();
server.get('/athletes', athleteControllers.listAll);



server.listen(process.env.PORT, () => {console.log(`Listening on port ${process.env.PORT}...`)});