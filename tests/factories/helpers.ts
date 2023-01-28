import { db } from 'database/database';

export async function cleanDb() {
  await db.event.deleteMany({});
  await db.users.deleteMany({});
}
