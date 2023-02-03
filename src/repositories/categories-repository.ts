import { db } from 'database/database';

async function findAllByEvent(eventId: number) {
  return await db.categories.findMany({
    where: {
      eventId
    }
  });
}

async function findById(categoryId: number) {
  return await db.categories.findUnique({
    where: {
      id: categoryId
    }
  });
}

const categoriesRepository = {
  findAllByEvent,
  findById
};

export { categoriesRepository };
