import { event } from '.prisma/client';
import { faker } from '@faker-js/faker';
import { db } from 'database/database';

export async function createEvent({ createdBy, open, finished, absolute }: Partial<event>) {
  return await db.event.create({
    data: {
      createdBy,
      open,
      finished,
      absolute,
      name: faker.company.name(),
      date: faker.date.future(),
      price: faker.datatype.number({ min: 0 }),
      description: faker.lorem.paragraph()            
    }
  });
}
