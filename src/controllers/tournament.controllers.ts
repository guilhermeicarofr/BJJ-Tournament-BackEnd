import { Request, Response } from 'express';

import { Category } from '../protocols/tournament.js';
import { selectByCategory } from '../repositories/tournament.repository.js';
import { ageClass, weightClass } from '../utils/tournament.utils.js'

async function listTournament(req: Request, res: Response) {

    const { belt, age, weight } = req.params;

    const category = {
        belt: Number(belt),
        age: ageClass(age),
        weight: weightClass(weight)
    } as Category;

    try {
        const competitors = await selectByCategory(category);

        res.send(competitors.rows)
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

}

export { listTournament };