import { ApplicationError } from 'protocols/types';

function signUpError(message: string): ApplicationError {
  return {
    name: 'InvalidSignUp',
    message,
  };
}

function signInError(): ApplicationError {
  return {
    name: 'InvalidSignIn',
    message: 'Invalid credentials',
  };
}

function notFoundError(): ApplicationError {
  return {
    name: 'NotFound',
    message: 'Entity not found'
  };
}

const errors = {
  signUpError,
  signInError,
  notFoundError
};

export { errors };
