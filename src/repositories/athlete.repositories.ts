import { QueryResult } from 'pg';

import { db } from '../database/database.js';
import { Athlete } from '../protocols/athlete.js';

async function findAll(): Promise<QueryResult<Athlete>> {
    return db.query('SELECT * FROM athletes;');
}

export default { findAll };