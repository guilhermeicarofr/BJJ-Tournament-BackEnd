import { db } from 'database/database';

export async function cleanDb() {
  await db.categories.deleteMany({});
  await db.fights.deleteMany({});
  await db.event.deleteMany({});
  await db.users.deleteMany({});
  return;
}
