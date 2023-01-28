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

const eventsRepository = {
  findAll,
  findOpen,
  findClosed,
  findFinished,
  findById
};

export { eventsRepository };
