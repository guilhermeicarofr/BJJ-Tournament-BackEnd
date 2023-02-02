import { fights } from '@prisma/client';
import { db } from 'database/database';

export async function createFight({ categoryId, round, athlete1, athlete2, winner, previousFight1, previousFight2, final }: Partial<fights>) {
  return await db.fights.create({
    data: {
      categoryId,
      round,
      athlete1,
      athlete2,
      winner,
      previousFight1,
      previousFight2,
      final
    }
  });
}

export async function countFights(eventId: number) {
  return await db.fights.count({
    where: {
      categories: {
        eventId
      }
    }
  });  
}
