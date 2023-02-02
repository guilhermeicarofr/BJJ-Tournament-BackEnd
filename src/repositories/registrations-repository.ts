import { db } from "database/database"

async function findAllByCategory(categoryId: number) {
  return await db.registrations.findMany({
    where: {
      categoryId
    }
  });
}

const registrationsRepository = {
  findAllByCategory
}

export { registrationsRepository };
