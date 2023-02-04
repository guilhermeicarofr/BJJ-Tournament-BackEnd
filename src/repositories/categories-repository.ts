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

async function findByInfo(info: { eventId: number, absolute: boolean, belt: number, weightClass: number, ageClass: number, male: boolean }) {
  return await db.categories.findFirst({
    where: {
      eventId: info.eventId,
      ageClass: info.ageClass,
      weightClass: info.weightClass,
      absolute: info.absolute,
      belt: info.belt,
      male: info.male
    }
  });
}

async function create(data: { eventId: number, absolute: boolean, belt: number, weightClass: number, ageClass: number, male: boolean }) {
  return await db.categories.create({
    data
  });
}

const categoriesRepository = {
  findAllByEvent,
  findById,
  findByInfo,
  create
};

export { categoriesRepository };
