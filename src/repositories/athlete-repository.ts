import { db } from 'database/database';
import { AthleteInfoData } from 'protocols/types';

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

async function createInfo(userId: number, data: AthleteInfoData) {
  return await db.athleteInfo.create({
    data: {
      userId,
      belt: data.belt,
      age: data.age,
      male: data.male,
      weight: data.weight
    }
  });
}

async function updateInfo(athleteInfoId: number, data: AthleteInfoData) {
  return await db.athleteInfo.update({
    where: {
      id: athleteInfoId,
    },
    data
  });
}

const athleteRepository = {
  findUserInfo,
  createInfo,
  updateInfo
};

export { athleteRepository };
