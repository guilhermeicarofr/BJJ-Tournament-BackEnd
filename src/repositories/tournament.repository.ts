import { QueryResult } from 'pg';

import { db } from '../database/database.js';
import { Athlete } from '../protocols/athlete.js';
import { Category } from '../protocols/tournament.js'

function selectByCategory(category: Category): Promise<QueryResult<Athlete>> {
    return db.query(`SELECT athletes.id, athletes.name, athletes.weight, athletes.age, athletes.team, belts.name AS "belt" 
                        FROM athletes 
                        JOIN belts ON athletes.belt_id=belts.id
                        WHERE athletes.belt_id=$1
                        AND athletes.age >= $2
                        AND athletes.age < $3
                        AND athletes.weight >= $4
                        AND athletes.weight < $5;`,
                        [
                            category.belt, 
                            category.age[0],
                            category.age[1],
                            category.weight[0],
                            category.weight[1]
                        ]);
}

export { selectByCategory };