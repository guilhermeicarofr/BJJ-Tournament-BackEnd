import express from "express";
import { config } from 'dotenv';
config();
var server = express();
server.listen(process.env.PORT, function () { console.log('Listening on port 4000...'); });
