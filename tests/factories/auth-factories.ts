import { users } from '.prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { userRepository } from 'repositories/user-repository';

export async function createUser(password: string) {
  return await userRepository.create({
    name: faker.name.firstName(),
    cpf: String(faker.datatype.number({ min: 11111111111 })),
    email: faker.internet.email(),
    password: bcrypt.hashSync(password, 10)
  });
}

export async function createToken(user: users) {
  const SECRET = process.env.JWT_SECRET;
  const token = jwt.sign({ userId: user.id, userName: user.name }, SECRET);
  return token;
}
