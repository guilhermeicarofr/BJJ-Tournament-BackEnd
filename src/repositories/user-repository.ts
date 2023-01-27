import { db } from 'database/database';
import { SignUpData } from 'protocols/types';

async function findByEmail(email: string) {
  return db.users.findFirst({
    where: {
      email
    }
  });
}

async function findByCpf(cpf: string) {
  return db.users.findFirst({
    where: {
      cpf
    }
  });
}

async function findById(id: number) {
  return db.users.findUnique({
    where: {
      id
    }
  });
}

async function create(data: SignUpData) {
  return db.users.create({
    data
  });
}

const userRepository = {
  findByEmail,
  findByCpf,
  findById,
  create,
};

export { userRepository };
