import { db } from 'database/database';

export async function cleanDb() {
  db.users.deleteMany({});
}
