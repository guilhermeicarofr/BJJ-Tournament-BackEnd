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
    },
  });
}

async function findAllByCategory(categoryId: number) {
  return await db.fights.findMany({
    where: {
      categoryId
    },
    orderBy: {
      round: 'asc'
    },
    include: {
      users_fights_athlete1Tousers: {
        select: {
          name: true
        }
      },
      users_fights_athlete2Tousers: {
        select: {
          name: true
        }
      }
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

async function findById(id: number) {
  return await db.fights.findUnique({
    where: {
      id
    },
    include: {
      users_fights_athlete1Tousers: {
        select: {
          name: true
        }
      },
      users_fights_athlete2Tousers: {
        select: {
          name: true
        }
      },
      categories: {
        include: {
          event: true
        }
      }
    }
  });
}

async function findFinalByCategory(categoryId: number) {
  return await db.fights.findFirst({
    where: {
      categoryId,
      final: true
    },
    include: {
      users_fights_athlete1Tousers: {
        select: {
          name: true
        }
      },
      users_fights_athlete2Tousers: {
        select: {
          name: true
        }
      }
    }
  });
}


async function findNextFight(fightId: number) {
  return await db.fights.findFirst({
    where: {
      OR: [
        { previousFight1: fightId },
        { previousFight2: fightId }
      ]
    }
  });
}

async function updatePrevFight({ fightId, prev, winnerId }: { fightId: number, prev: ('athlete1' | 'athlete2'), winnerId: number }) {
  return await db.fights.update({
    where: {
      id: fightId
    },
    data: {
      [prev]: winnerId
    }
  });
}

async function updateWinner(fightId: number, winnerId: number) {
  return await db.fights.update({
    where: {
      id: fightId
    },
    data: {
      winner: winnerId
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
  findById,
  findNextFight,
  findFinalByCategory,
  create,
  updateWinner,
  updatePrevFight
};

export { fightsRepository };
