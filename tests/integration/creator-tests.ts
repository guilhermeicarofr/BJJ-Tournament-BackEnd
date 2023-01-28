import httpStatus from 'http-status';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';

import { server } from 'index';
import { cleanDb } from '../factories/helpers';
import { createEvent } from '../factories/events-factories';
import { createToken, createUser } from '../factories/auth-factories';
import { faker } from '@faker-js/faker';

beforeEach(async () => {
  await cleanDb();
});

const testServer = supertest(server);

describe('GET /creator/events', () => {
  describe('when login authorization is invalid', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await testServer.get('/creator/events');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await testServer.get('/creator/events').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if token does not match a user', async () => {
      const SECRET = process.env.JWT_SECRET;
      const token = jwt.sign({ userId: 1, userName: 'Name' }, SECRET);
  
      const response = await testServer.get('/creator/events').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  it('should respond with status 200 and empty list when there is no events created', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const response = await testServer.get('/creator/events').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual([]);
  });

  it('should respond with status 200 and all user created events', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const event1 = await createEvent({ createdBy: user.id, open: true, finished: false, absolute: false });
    const event2 = await createEvent({ createdBy: user.id, open: false, finished: false, absolute: false });
    const event3 = await createEvent({ createdBy: user.id, open: false, finished: true, absolute: false });

    const response = await testServer.get('/creator/events').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual(expect.arrayContaining([
      { 
        ...event1,
        date: event1.date.toISOString(),
        createdAt: event1.createdAt.toISOString(),
        updatedAt: event1.updatedAt.toISOString()
      },
      { 
        ...event2,
        date: event2.date.toISOString(),
        createdAt: event2.createdAt.toISOString(),
        updatedAt: event2.updatedAt.toISOString()
      },
      { 
        ...event3,
        date: event3.date.toISOString(),
        createdAt: event3.createdAt.toISOString(),
        updatedAt: event3.updatedAt.toISOString()
      }
    ]));
  });
});