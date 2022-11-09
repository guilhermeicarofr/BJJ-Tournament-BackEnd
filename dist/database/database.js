import { Pool } from 'pg';
import { config } from 'dotenv';
config();
var db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
export { db };
