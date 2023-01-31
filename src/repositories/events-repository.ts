import { event } from '@prisma/client';
import { db } from 'database/database';

async function findAll() {
  return await db.event.findMany({});
}

async function findOpen() {
  return await db.event.findMany({
    where: {
      open: true,
      finished: false
    }
  });
}

async function findClosed() {
  return await db.event.findMany({
    where: {
      open: false,
      finished: false
    }
  });
}

async function findFinished() {
  return await db.event.findMany({
    where: {
      open: false,
      finished: true
    }
  });
}

async function findById(id: number) {
  return await db.event.findUnique({
    where: {
      id
    }
  });
}

async function findByCreator(createdBy: number) {
  return await db.event.findMany({
    where: {
      createdBy
    }
  });
}

async function create(userId: number, data: Partial<event>) {
  return await db.event.create({
    data: {
      createdBy: userId,
      name: data.name,
      date: data.date,
      price: data.price,
      absolute: data.absolute,
      description: data.description
    },
  });
}

const eventsRepository = {
  findAll,
  findOpen,
  findClosed,
  findFinished,
  findById,
  findByCreator,
  create,
};

export { eventsRepository };
