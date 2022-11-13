import { Request, Response } from 'express';
import { Athlete } from '../protocols/athlete.js';
import athleteRepositories from '../repositories/athlete.repositories.js';

async function listAll(req: Request, res: Response) {
    try {
        const competitors = await athleteRepositories.findAll();
        res.send(competitors.rows);
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export default { listAll };