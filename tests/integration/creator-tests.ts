import httpStatus from 'http-status';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';

import { server } from 'index';
import { cleanDb } from '../factories/helpers';
import { createRegistration } from '../factories/registrations-factories';
import { createEvent } from '../factories/events-factories';
import { createToken, createUser } from '../factories/auth-factories';
import { faker } from '@faker-js/faker';
import { createCategory } from '../factories/categories-factories';
import { createFight } from '../factories/fights-factories';

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

describe('POST /creator/events', () => {
  describe('when login authorization is invalid', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await testServer.post('/creator/events');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await testServer.post('/creator/events').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if token does not match a user', async () => {
      const SECRET = process.env.JWT_SECRET;
      const token = jwt.sign({ userId: 1, userName: 'Name' }, SECRET);
  
      const response = await testServer.post('/creator/events').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('when body is invalid', () => {
    it('should respond with status 400 when body is not given', async () => {
      const password = faker.internet.password(6);
      const user = await createUser(password);
      const token = await createToken(user);

      const response = await testServer.post('/creator/events').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
  
    it('should respond with status 400 when body is not valid', async () => {
      const password = faker.internet.password(6);
      const user = await createUser(password);
      const token = await createToken(user);

      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await testServer.post('/creator/events').send(invalidBody).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
  });

  it('should respond with status 201 and created event', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const body = {
      name: faker.company.name(),
      date: faker.date.future(),
      price: faker.datatype.number({ min: 0 }),
      description: faker.lorem.paragraph(),
      absolute: true
    };

    const response = await testServer.post('/creator/events').send(body).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CREATED);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        createdBy: user.id,
        name: body.name,
        price: body.price,
        description: body.description,
        absolute: body.absolute,
        open: true,
        finished: false
      })
    );
  });
});

describe('PUT /creator/events/:eventId/close', () => {
  describe('when login authorization is invalid', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await testServer.put(`/creator/events/${faker.datatype.number({ min: 1 })}/close`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await testServer.put(`/creator/events/${faker.datatype.number({ min: 1 })}/close`).set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if token does not match a user', async () => {
      const SECRET = process.env.JWT_SECRET;
      const token = jwt.sign({ userId: 1, userName: 'Name' }, SECRET);
  
      const response = await testServer.put(`/creator/events/${faker.datatype.number({ min: 1 })}/close`).set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('when param is invalid', () => {
    it('should respond with status 400 when param eventId is a string', async () => {
      const password = faker.internet.password(6);
      const user = await createUser(password);
      const token = await createToken(user);

      const response = await testServer.put(`/creator/events/${faker.word.noun()}/close`).set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
  
    it('should respond with status 400 when param eventId is less than 1', async () => {
      const password = faker.internet.password(6);
      const user = await createUser(password);
      const token = await createToken(user);

      const response = await testServer.put('/creator/events/0/close').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
  });

  it('should respond with status 404 when param eventId not from an existent event', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const response = await testServer.put(`/creator/events/${faker.datatype.number({ min: 1 })}/close`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 403 when param eventId is from an event not owned by user', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const password2 = faker.internet.password(6);
    const user2 = await createUser(password2);
    const event = await createEvent({ createdBy: user2.id, open: true, finished: false, absolute: false });

    const response = await testServer.put(`/creator/events/${event.id}/close`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 402 when event is in the wrong state', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const event = await createEvent({ createdBy: user.id, open: false, finished: true, absolute: false });

    const response = await testServer.put(`/creator/events/${event.id}/close`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  it('should respond with status 200 and update event', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const event = await createEvent({ createdBy: user.id, open: true, finished: false, absolute: false });

    const response = await testServer.put(`/creator/events/${event.id}/close`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
  });
});

describe('PUT /creator/events/:eventId/finish', () => {
  describe('when login authorization is invalid', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await testServer.put(`/creator/events/${faker.datatype.number({ min: 1 })}/finish`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await testServer.put(`/creator/events/${faker.datatype.number({ min: 1 })}/finish`).set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if token does not match a user', async () => {
      const SECRET = process.env.JWT_SECRET;
      const token = jwt.sign({ userId: 1, userName: 'Name' }, SECRET);
  
      const response = await testServer.put(`/creator/events/${faker.datatype.number({ min: 1 })}/finish`).set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('when param is invalid', () => {
    it('should respond with status 400 when param eventId is a string', async () => {
      const password = faker.internet.password(6);
      const user = await createUser(password);
      const token = await createToken(user);

      const response = await testServer.put(`/creator/events/${faker.word.noun()}/finish`).set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
  
    it('should respond with status 400 when param eventId is less than 1', async () => {
      const password = faker.internet.password(6);
      const user = await createUser(password);
      const token = await createToken(user);

      const response = await testServer.put('/creator/events/0/finish').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
  });

  it('should respond with status 404 when param eventId not from an existent event', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const response = await testServer.put(`/creator/events/${faker.datatype.number({ min: 1 })}/finish`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 403 when param eventId is from an event not owned by user', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const password2 = faker.internet.password(6);
    const user2 = await createUser(password2);
    const event = await createEvent({ createdBy: user2.id, open: true, finished: false, absolute: false });

    const response = await testServer.put(`/creator/events/${event.id}/finish`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 402 when event is in the wrong state', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const event = await createEvent({ createdBy: user.id, open: true, finished: false, absolute: false });

    const response = await testServer.put(`/creator/events/${event.id}/finish`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  it('should respond with status 402 when event still has open fights', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const password2 = faker.internet.password(6);
    const user2 = await createUser(password2);

    const event = await createEvent({ createdBy: user.id, open: false, finished: false, absolute: false });
    const category = await createCategory({
      eventId: event.id,
      absolute: false,
      male: true,
      belt: 1,
      ageClass: 1,
      weightClass: 1
    });

    await createRegistration({ userId: user.id, categoryId: category.id });
    await createRegistration({ userId: user2.id, categoryId: category.id });

    await createFight({
      categoryId: category.id,
      round: 1,
      athlete1: user.id,
      athlete2: user2.id,
      winner: null,
      previousFight1: null,
      previousFight2: null,
      final: true
    });

    const response = await testServer.put(`/creator/events/${event.id}/finish`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  it('should respond with status 402 when event there are unfinished categories', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const password2 = faker.internet.password(6);
    const user2 = await createUser(password2);

    const event = await createEvent({ createdBy: user.id, open: false, finished: false, absolute: false });
    const category = await createCategory({
      eventId: event.id,
      absolute: false,
      male: true,
      belt: 1,
      ageClass: 1,
      weightClass: 1
    });
    const category2 = await createCategory({
      eventId: event.id,
      absolute: true,
      male: true,
      belt: 1,
      ageClass: null,
      weightClass: null
    });

    await createRegistration({ userId: user.id, categoryId: category.id });
    await createRegistration({ userId: user2.id, categoryId: category.id });

    await createRegistration({ userId: user.id, categoryId: category2.id });
    await createRegistration({ userId: user2.id, categoryId: category2.id });

    await createFight({
      categoryId: category.id,
      round: 1,
      athlete1: user.id,
      athlete2: user2.id,
      winner: user2.id,
      previousFight1: null,
      previousFight2: null,
      final: true
    });

    const response = await testServer.put(`/creator/events/${event.id}/finish`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  it('should respond with status 200 and update event', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const event = await createEvent({ createdBy: user.id, open: false, finished: false, absolute: false });

    const response = await testServer.put(`/creator/events/${event.id}/finish`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
  });
});
