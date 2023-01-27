import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { users } from '@prisma/client';

import { errors } from 'errors/errors';
import { SignInData, SignUpData } from 'protocols/types';
import { userRepository } from 'repositories/user-repository';

async function userEmailInUse(email: string) {
  const user = await userRepository.findByEmail(email);
  if(user) throw errors.signUpError('email unavailable');
  return;
}

async function userCpfInUse(cpf: string) {
  const user = await userRepository.findByCpf(cpf);
  if(user) throw errors.signUpError('cpf unavailable');
  return;
}

async function userEmailCheck(email: string) {
  const user = await userRepository.findByEmail(email);
  if(!user) throw errors.signInError();
  return user;
}

function validateUserPassword(user: users, password: string) {
  if(!bcrypt.compareSync(password, user.password)) throw errors.signInError();
  return;
}

export async function userIdCheck(userId: number) {
  const user = await userRepository.findById(userId);
  if(!user) throw errors.signInError();
  return;
}

export async function registerNewUser(data: SignUpData) {
  const { name, cpf, email, password } = data;

  const passwordHash = bcrypt.hashSync(password, 10);

  await userEmailInUse(email); 
  await userCpfInUse(cpf);
    
  await userRepository.create({ name, cpf, email, password: passwordHash });
  return;
}

export async function signInUser(data: SignInData) {
  const { email, password } = data;

  const user = await userEmailCheck(email);
  validateUserPassword(user, password);
  
  const SECRET = process.env.JWT_SECRET;
  const token = jwt.sign({ userName: user.name, userId: user.id }, SECRET);
  return token;
}
