import { QueryResult } from 'pg';

import { db } from '../database/database.js';
import { Athlete } from '../protocols/athlete.js';

async function selectAll(): Promise<QueryResult<Athlete>> {
    return db.query(`SELECT athletes.id, athletes.name, athletes.weight, athletes.age, athletes.team, belts.name AS "belt" 
                        FROM athletes 
                        JOIN belts ON athletes.belt_id=belts.id;`);
}

async function selectOne(id: string): Promise<QueryResult<Athlete>> {
    return db.query(`SELECT athletes.name, athletes.weight, athletes.age, athletes.team, belts.name AS "belt" 
                        FROM athletes 
                        JOIN belts ON athletes.belt_id=belts.id
                        WHERE athletes.id=$1;`,
                        [ id ]);
}

async function insert(newAthlete: Athlete): Promise<void> {
    return db.query(`INSERT INTO athletes (name, weight, age, team, belt_id)
                        VALUES ($1, $2, $3, $4, $5);`,
                        [ newAthlete.name, newAthlete.weight, newAthlete.age, newAthlete.team, newAthlete.belt ]);
}

async function update(id: string, updateAthlete: Athlete): Promise<void> {
    return db.query(`UPDATE athletes SET
                        name=$2, weight=$3, age=$4, team=$5, belt_id=$6
                        WHERE id=$1;`,
                        [ id, updateAthlete.name, updateAthlete.weight, updateAthlete.age, updateAthlete.team, updateAthlete.belt ]);
}

async function deleteOne(id: string): Promise<void> {
    return db.query(`DELETE FROM athletes
                        WHERE id=$1;`,
                        [ id ]);
}

export default { selectAll, selectOne, insert, update, deleteOne };