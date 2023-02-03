import httpStatus from 'http-status';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';

import { server } from 'index';
import { cleanDb } from '../factories/helpers';
import { createRegistration } from '../factories/registrations-factories';
import { createEvent } from '../factories/events-factories';
import { createToken, createUser } from '../factories/auth-factories';
import { createCategory } from '../factories/categories-factories';
import { countFights, createFight, getFight } from '../factories/fights-factories';

beforeEach(async () => {
  await cleanDb();
});

const testServer = supertest(server);

describe('POST /creator/events/:eventId/fights', () => {
  describe('when login authorization is invalid', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await testServer.post(`/creator/events/${faker.datatype.number({ min: 1 })}/fights`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await testServer.post(`/creator/events/${faker.datatype.number({ min: 1 })}/fights`).set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if token does not match a user', async () => {
      const SECRET = process.env.JWT_SECRET;
      const token = jwt.sign({ userId: 1, userName: 'Name' }, SECRET);
  
      const response = await testServer.post(`/creator/events/${faker.datatype.number({ min: 1 })}/fights`).set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('when param is invalid', () => {
    it('should respond with status 400 when param eventId is a string', async () => {
      const password = faker.internet.password(6);
      const user = await createUser(password);
      const token = await createToken(user);

      const response = await testServer.post(`/creator/events/${faker.word.noun()}/fights`).set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
  
    it('should respond with status 400 when param eventId is less than 1', async () => {
      const password = faker.internet.password(6);
      const user = await createUser(password);
      const token = await createToken(user);

      const response = await testServer.post('/creator/events/0/fights').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
  });

  it('should respond with status 404 when param eventId not from an existent event', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const response = await testServer.post(`/creator/events/${faker.datatype.number({ min: 1 })}/fights`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 403 when param eventId is from an event not owned by user', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const password2 = faker.internet.password(6);
    const user2 = await createUser(password2);
    const event = await createEvent({ createdBy: user2.id, open: true, finished: false, absolute: false });

    const response = await testServer.post(`/creator/events/${event.id}/fights`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 402 when event is in the wrong state', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const event = await createEvent({ createdBy: user.id, open: false, finished: true, absolute: false });

    const response = await testServer.post(`/creator/events/${event.id}/fights`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  it('should respond with status 201 and create one fight if there is only one fighter', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

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

    const response = await testServer.post(`/creator/events/${event.id}/fights`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CREATED);
    expect(response.body).toEqual([ category.id ]);
    const count = await countFights(event.id);
    expect(count).toBe(1);
  });

  it('should respond with status 201 and create one fight between users', async () => {
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

    const response = await testServer.post(`/creator/events/${event.id}/fights`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CREATED);
    expect(response.body).toEqual([ category.id ]);
    const count = await countFights(event.id);
    expect(count).toBe(1);
  });

  it('should respond with status 201 and create 11 fights in case of 12 competitors in category', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const event = await createEvent({ createdBy: user.id, open: false, finished: false, absolute: false });

    const category = await createCategory({
      eventId: event.id,
      absolute: false,
      male: true,
      belt: 1,
      ageClass: 1,
      weightClass: 1
    });

    for(let i=1; i<=12; i++) {
      const password2 = faker.internet.password(6);
      const fighter = await createUser(password2);
      await createRegistration({ userId: fighter.id, categoryId: category.id });
    }

    const response = await testServer.post(`/creator/events/${event.id}/fights`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CREATED);
    expect(response.body).toEqual([ category.id ]);
    const count = await countFights(event.id);
    expect(count).toBe(11);
  });

  it('should respond with status 201 and create 8 fights in case of 9 competitors in category', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const event = await createEvent({ createdBy: user.id, open: false, finished: false, absolute: false });

    const category = await createCategory({
      eventId: event.id,
      absolute: false,
      male: true,
      belt: 1,
      ageClass: 1,
      weightClass: 1
    });

    for(let i=1; i<=9; i++) {
      const password2 = faker.internet.password(6);
      const fighter = await createUser(password2);
      await createRegistration({ userId: fighter.id, categoryId: category.id });
    }

    const response = await testServer.post(`/creator/events/${event.id}/fights`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CREATED);
    expect(response.body).toEqual([ category.id ]);
    const count = await countFights(event.id);
    expect(count).toBe(8);
  });

  it('should respond with status 201 and create 26 fights in case of 27 competitors in category', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const event = await createEvent({ createdBy: user.id, open: false, finished: false, absolute: false });

    const category = await createCategory({
      eventId: event.id,
      absolute: false,
      male: true,
      belt: 1,
      ageClass: 1,
      weightClass: 1
    });

    for(let i=1; i<=27; i++) {
      const password2 = faker.internet.password(6);
      const fighter = await createUser(password2);
      await createRegistration({ userId: fighter.id, categoryId: category.id });
    }

    const response = await testServer.post(`/creator/events/${event.id}/fights`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CREATED);
    expect(response.body).toEqual([ category.id ]);
    const count = await countFights(event.id);
    expect(count).toBe(26);
  });
});

describe('PUT /creator/fights/:fightId/winner', () => {
  describe('when login authorization is invalid', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await testServer
        .put(`/creator/fights/${faker.datatype.number({ min: 1 })}/winner`)
        .send({ winnerId: faker.datatype.number({ min: 1 }) });
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await testServer
        .put(`/creator/fights/${faker.datatype.number({ min: 1 })}/winner`)
        .send({ winnerId: faker.datatype.number({ min: 1 }) })
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if token does not match a user', async () => {
      const SECRET = process.env.JWT_SECRET;
      const token = jwt.sign({ userId: 1, userName: 'Name' }, SECRET);
  
      const response = await testServer
        .put(`/creator/fights/${faker.datatype.number({ min: 1 })}/winner`)
        .send({ winnerId: faker.datatype.number({ min: 1 }) })
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('when param or body is invalid', () => {
    it('should respond with status 400 when param eventId is a string', async () => {
      const password = faker.internet.password(6);
      const user = await createUser(password);
      const token = await createToken(user);

      const response = await testServer
        .put(`/creator/fights/${faker.word.noun()}/winner`)
        .send({ winnerId: faker.datatype.number({ min: 1 }) })
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
  
    it('should respond with status 400 when param eventId is less than 1', async () => {
      const password = faker.internet.password(6);
      const user = await createUser(password);
      const token = await createToken(user);

      const response = await testServer
        .put('/creator/fights/0/winner')
        .send({ winnerId: faker.datatype.number({ min: 1 }) })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when body is not sent', async () => {
      const password = faker.internet.password(6);
      const user = await createUser(password);
      const token = await createToken(user);
  
      const response = await testServer
        .put(`/creator/fights/${faker.datatype.number({ min: 1 })}/winner`)
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
  
    it('should respond with status 400 when body winnerId is less than 1', async () => {
      const password = faker.internet.password(6);
      const user = await createUser(password);
      const token = await createToken(user);
  
      const response = await testServer
        .put(`/creator/fights/${faker.datatype.number({ min: 1 })}/winner`)
        .send({ winnerId: 0 })
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
  
    it('should respond with status 400 when body winnerId is not a number', async () => {
      const password = faker.internet.password(6);
      const user = await createUser(password);
      const token = await createToken(user);
  
      const response = await testServer
        .put(`/creator/fights/${faker.datatype.number({ min: 1 })}/winner`)
        .send({ winnerId: 'string' })
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
  });

  it('should respond with status 404 when param fightId is not from an existent fight', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const response = await testServer
      .put(`/creator/fights/${faker.datatype.number({ min: 1 })}/winner`)
      .send({ winnerId: faker.datatype.number({ min: 1 }) })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 403 when param fightId is from an event not owned by user', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const password2 = faker.internet.password(6);
    const user2 = await createUser(password2);

    const event = await createEvent({ createdBy: user2.id, open: true, finished: false, absolute: false });
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

    const fight = await createFight({
      categoryId: category.id,
      round: 1,
      athlete1: user.id,
      athlete2: user2.id,
      winner: null,
      previousFight1: null,
      previousFight2: null,
      final: true
    });

    const response = await testServer
      .put(`/creator/fights/${fight.id}/winner`)
      .send({ winnerId: user.id })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 402 when fight already has a winner', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const password2 = faker.internet.password(6);
    const user2 = await createUser(password2);

    const event = await createEvent({ createdBy: user.id, open: true, finished: false, absolute: false });
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

    const fight = await createFight({
      categoryId: category.id,
      round: 1,
      athlete1: user.id,
      athlete2: user2.id,
      winner: user.id,
      previousFight1: null,
      previousFight2: null,
      final: true
    });

    const response = await testServer
      .put(`/creator/fights/${fight.id}/winner`)
      .send({ winnerId: user2.id })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  it('should respond with status 402 when fight does not have two fighters', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const password2 = faker.internet.password(6);
    const user2 = await createUser(password2);

    const event = await createEvent({ createdBy: user.id, open: true, finished: false, absolute: false });
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

    const fight = await createFight({
      categoryId: category.id,
      round: 1,
      athlete1: user.id,
      athlete2: null,
      winner: null,
      previousFight1: null,
      previousFight2: null,
      final: true
    });

    const response = await testServer
      .put(`/creator/fights/${fight.id}/winner`)
      .send({ winnerId: user2.id })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  it('should respond with status 402 when winnerId is not one of the two fighters', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const password2 = faker.internet.password(6);
    const user2 = await createUser(password2);

    const password3 = faker.internet.password(6);
    const user3 = await createUser(password3);

    const event = await createEvent({ createdBy: user.id, open: true, finished: false, absolute: false });
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

    const fight = await createFight({
      categoryId: category.id,
      round: 1,
      athlete1: user.id,
      athlete2: user2.id,
      winner: null,
      previousFight1: null,
      previousFight2: null,
      final: true
    });

    const response = await testServer
      .put(`/creator/fights/${fight.id}/winner`)
      .send({ winnerId: user3.id })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  it('should respond with status 404 when winnerId is not an user', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const password2 = faker.internet.password(6);
    const user2 = await createUser(password2);

    const event = await createEvent({ createdBy: user.id, open: true, finished: false, absolute: false });
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

    const fight = await createFight({
      categoryId: category.id,
      round: 1,
      athlete1: user.id,
      athlete2: user2.id,
      winner: null,
      previousFight1: null,
      previousFight2: null,
      final: true
    });

    const response = await testServer
      .put(`/creator/fights/${fight.id}/winner`)
      .send({ winnerId: faker.datatype.number({ min: 1 }) })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 201 and update final fight', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const password2 = faker.internet.password(6);
    const user2 = await createUser(password2);

    const event = await createEvent({ createdBy: user.id, open: true, finished: false, absolute: false });
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

    const fight = await createFight({
      categoryId: category.id,
      round: 1,
      athlete1: user.id,
      athlete2: user2.id,
      winner: null,
      previousFight1: null,
      previousFight2: null,
      final: true
    });

    const response = await testServer
      .put(`/creator/fights/${fight.id}/winner`)
      .send({ winnerId: user.id })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CREATED);

    const checkFight1 = await getFight(fight.id);
    expect(checkFight1.winner).toEqual(user.id);
  });

  it('should respond with status 201 and update fight winner and next fight athlete', async () => {
    const password = faker.internet.password(6);
    const user = await createUser(password);
    const token = await createToken(user);

    const password2 = faker.internet.password(6);
    const user2 = await createUser(password2);

    const password3 = faker.internet.password(6);
    const user3 = await createUser(password3);

    const event = await createEvent({ createdBy: user.id, open: true, finished: false, absolute: false });
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
    await createRegistration({ userId: user3.id, categoryId: category.id });

    const fight1 = await createFight({
      categoryId: category.id,
      round: 1,
      athlete1: user.id,
      athlete2: user2.id,
      winner: null,
      previousFight1: null,
      previousFight2: null,
      final: false
    });

    const fight2 = await createFight({
      categoryId: category.id,
      round: 2,
      athlete1: null,
      athlete2: user3.id,
      winner: null,
      previousFight1: fight1.id,
      previousFight2: null,
      final: true
    });

    const response = await testServer
      .put(`/creator/fights/${fight1.id}/winner`)
      .send({ winnerId: user.id })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CREATED);

    const checkFight1 = await getFight(fight1.id);
    expect(checkFight1.winner).toEqual(user.id);
    
    const checkFight2 = await getFight(fight2.id);
    expect(checkFight2.athlete1).toEqual(user.id);
  });
});
