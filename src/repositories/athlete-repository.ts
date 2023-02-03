import { db } from 'database/database';

async function findUserInfo(userId: number) {
  return await db.athleteInfo.findFirst({
    where: {
      userId
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          cpf: true
        }
      }
    }
  });
}

const athleteRepository = {
  findUserInfo
};

export { athleteRepository };
