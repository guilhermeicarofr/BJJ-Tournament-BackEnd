import { db } from 'database/database';

export async function cleanDb() {
  await db.fights.updateMany({
    where: {
        NOT: {
          OR: [
            { previousFight1: null },
            { previousFight2: null },
            { athlete1: null },
            { athlete2: null }
          ]
        }
      },
      data: {
        previousFight1: null,
        previousFight2: null,
        athlete1: null,
        athlete2: null
      }
  });
  await db.registrations.deleteMany({});
  await db.fights.deleteMany({});
  await db.categories.deleteMany({});
  await db.event.deleteMany({});
  await db.athleteInfo.deleteMany({});
  await db.users.deleteMany({});
  return;
}
