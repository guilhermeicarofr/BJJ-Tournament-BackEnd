import { Request, Response } from 'express';

import { Category } from '../protocols/tournament.js';
import { selectAbsolute, selectBelt, selectByCategory } from '../repositories/tournament.repository.js';
import { ageClass, weightClass } from '../utils/tournament.utils.js'

async function listTournament(req: Request, res: Response) {

    const { belt, age, weight } = req.params;

    const category = {
        belt: Number(belt),
        age: ageClass(age),
        weight: weightClass(weight)
    } as Category;

    try {
        const checkBelt = await selectBelt(belt);
        if(checkBelt.rowCount < 1) {
            res.sendStatus(404);
            return;
        }

        const competitors = await selectByCategory(category);
        res.send(competitors.rows)
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function listAbsolute(req: Request, res: Response) {
    const { belt } = req.params;

    try {
        const checkBelt = await selectBelt(belt);
        if(checkBelt.rowCount < 1) {
            res.sendStatus(404);
            return;
        }

        const competitors = await selectAbsolute(belt);
        res.send(competitors.rows)
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export { listTournament, listAbsolute };