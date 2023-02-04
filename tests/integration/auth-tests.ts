import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';

import { server } from 'index';
import supertest from 'supertest';
import { createUser } from '../factories/auth-factories';
import { cleanDb } from '../factories/helpers';

beforeEach(async () => {
  jest.setTimeout(10000);
  await cleanDb();
});

const testServer = supertest(server);

describe('POST /auth/signin', () => {
  function generateValidBody() {
    return {
      email: faker.internet.email(),
      password: faker.internet.password(6),  
    };
  }

  it('should respond with status 400 when body is not given', async () => {
    const response = await testServer.post('/auth/signin');

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 when body is not valid', async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await testServer.post('/auth/signin').send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe('when body is valid', () => {
    it('should respond with status 401 if there is no user for given email', async () => {
      const body = generateValidBody();

      const response = await testServer.post('/auth/signin').send(body);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is a user for given email but password is not correct', async () => {
      const password = faker.internet.password(6);
      const user = await createUser(password);

      const response = await testServer.post('/auth/signin').send({
        email: user.email,
        password: faker.internet.password(6),
      });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when credentials are valid', () => {
      it('should respond with status 200', async () => {
        const password = faker.internet.password(6);
        const user = await createUser(password);
 
        const response = await testServer.post('/auth/signin').send({
          email: user.email,
          password: password
        });

        expect(response.status).toBe(httpStatus.OK);

        const SECRET = process.env.JWT_SECRET;
        expect(jwt.verify(response.body.token, SECRET)).toEqual({
          iat: expect.anything(),
          userId: user.id,
          userName: user.name,
        });
      });
    });
  });
});

describe('POST /auth/signup', () => {
  it('should respond with status 400 when body is not given', async () => {
    const response = await testServer.post('/auth/signup');

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 when body is not valid', async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await testServer.post('/auth/signup').send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe('when body is valid', () => {
    it('should respond with status 403 if email is already in use', async () => {
      const password = faker.internet.password(6);
      const otherUser = await createUser(password);

      const body = {
        name: faker.name.firstName(),
        cpf: String(faker.datatype.number({ min: 11111111111 })),
        email: otherUser.email,
        password: faker.internet.password(6),
      };

      const response = await testServer.post('/auth/signup').send(body);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if cpf is already in use', async () => {
      const password = faker.internet.password(6);
      const otherUser = await createUser(password);

      const body = {
        name: faker.name.firstName(),
        cpf: otherUser.cpf,
        email: faker.internet.email(),
        password: faker.internet.password(6),
      };

      const response = await testServer.post('/auth/signup').send(body);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    describe('when data is valid', () => {
      it('should respond with status 201', async () => {
        const body = {
          name: faker.name.firstName(),
          cpf: String(faker.datatype.number({ min: 11111111111 })),
          email: faker.internet.email(),
          password: faker.internet.password(6),
        };

        const response = await testServer.post('/auth/signup').send(body);

        expect(response.status).toBe(httpStatus.CREATED);
      });
    });
  });
});
