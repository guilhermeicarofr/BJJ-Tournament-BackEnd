import { db } from "database/database";

async function findAllByEvent(eventId: number) {
  return await db.categories.findMany({
    where: {
      eventId
    }
  });
}

const categoriesRepository = {
  findAllByEvent
};

export { categoriesRepository };
