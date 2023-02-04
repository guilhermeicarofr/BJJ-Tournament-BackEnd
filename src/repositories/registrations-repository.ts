import { db } from 'database/database';

async function findAllByCategory(categoryId: number) {
  return await db.registrations.findMany({
    where: {
      categoryId
    },
    include: {
      users: {
        include: {
          athleteInfo: true
        }
      }
    }
  });
}

async function findAllFromUserByEvent(userId: number, eventId: number) {
  return await db.registrations.findMany({
    where: {
      userId,
      categories: {
        eventId
      }
    },
    include: {
      categories: true
    }
  });
}

const registrationsRepository = {
  findAllByCategory,
  findAllFromUserByEvent
};

export { registrationsRepository };
