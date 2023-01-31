import { db } from "database/database";

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

const fightsRepository = {
  findAllFinalsInEvent,
  findAllNotFinishedInEvent
};

export { fightsRepository };
