import { fights } from '@prisma/client';
import { db } from 'database/database';

async function findAllNotFinishedInEvent(eventId: number) {
  return await db.fights.findMany({
    where: {
      categories: {
        eventId
      },
      winner: null
    }
  });
}

async function findAllFinalsInEvent(eventId: number) {
  return await db.fights.findMany({
    where: {
      categories: {
        eventId,
      },
      final: true
    }
  });
}

async function findAllByCategory(categoryId: number) {
  return await db.fights.findMany({
    where: {
      categoryId
    }
  });
}

async function findCategoryRoundFights(categoryId: number, round: number) {
  return await db.fights.findMany({
    where: {
      categoryId,
      round
    }
  });
}

async function create({ categoryId, round, final, previousFight1, previousFight2, athlete1, athlete2, winner }: Partial<fights>) {
  return await db.fights.create({
    data: {
      categoryId,
      round,
      final,
      previousFight1,
      previousFight2,
      athlete1,
      athlete2,
      winner,
    }
  });
}

const fightsRepository = {
  findAllFinalsInEvent,
  findAllNotFinishedInEvent,
  findAllByCategory,
  findCategoryRoundFights,
  create
};

export { fightsRepository };
