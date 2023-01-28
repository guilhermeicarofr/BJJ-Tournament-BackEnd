import httpStatus from 'http-status';
import supertest from 'supertest';

import { server } from 'index';
import { cleanDb } from '../factories/helpers';
import { createEvent } from '../factories/events-factories';
import { createUser } from '../factories/auth-factories';
import { faker } from '@faker-js/faker';

beforeEach(async () => {
  await cleanDb();
});

const testServer = supertest(server);

describe('GET /events/list', () => {
  it('should respond with status 200 and empty list if there are no events', async () => {

    const response = await testServer.get('/events/list');

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual([]);
  });

  it('should respond with status 200 and all events when no filter is given', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const event1 = await createEvent({ createdBy: user.id, open: true, finished: false, absolute: false });
    const event2 = await createEvent({ createdBy: user.id, open: false, finished: false, absolute: false });
    const event3 = await createEvent({ createdBy: user.id, open: false, finished: true, absolute: false });

    const response = await testServer.get('/events/list');

    expect(response.status).toBe(httpStatus.OK);
  });
});