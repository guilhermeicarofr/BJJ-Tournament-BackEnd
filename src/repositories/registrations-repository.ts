import { db } from 'database/database';

async function findAllByCategory(categoryId: number) {
  return await db.registrations.findMany({
    where: {
      categoryId
    },
    include: {
      users: {
        select: {
          name: true
        },
        include: {
          athleteInfo: true
        }
      }
    }
  });
}

const registrationsRepository = {
  findAllByCategory
};

export { registrationsRepository };
