import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

import { userRepository } from 'repositories/user-repository';

export async function createUser(password: string) {
  return await userRepository.create({
    name: faker.name.firstName(),
    cpf: String(faker.datatype.number({ min: 11111111111 })),
    email: faker.internet.email(),
    password: bcrypt.hashSync(password, 10)
  });
}
