import { db } from 'database/database';

export async function cleanDb() {
  await db.fights.deleteMany({});
  await db.registrations.deleteMany({});
  await db.categories.deleteMany({});
  await db.event.deleteMany({});
  await db.athleteInfo.deleteMany({});
  await db.users.deleteMany({});
  return;
}
