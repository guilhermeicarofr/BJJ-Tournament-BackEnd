import { Request, Response } from 'express';
import { Athlete } from '../protocols/athlete.js';
import athleteRepositories from '../repositories/athlete.repository.js';

async function readAll(req: Request, res: Response) {
    try {
        const competitors = await athleteRepositories.selectAll();
        res.send(competitors.rows);
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function createOne(req: Request, res: Response) {
    const newAthlete = req.body as Athlete;

    try {
        await athleteRepositories.insert(newAthlete);
        res.sendStatus(201);
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function updateOne(req: Request, res: Response) {
    const { id } = req.params;
    const updateAthlete = req.body as Athlete;

    try {
        const user = await athleteRepositories.selectOne(id);
        if(user.rowCount < 1) {
            res.sendStatus(404);
            return;
        }

        await athleteRepositories.update(id, updateAthlete);
        res.sendStatus(200);
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function removeOne(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const user = await athleteRepositories.selectOne(id);
        if(user.rowCount < 1) {
            res.sendStatus(404);
            return;
        }

        await athleteRepositories.deleteOne(id);
        res.sendStatus(204);
        return;        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export default { readAll, createOne, updateOne, removeOne };