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

const errors = {
  signUpError,
  signInError
};

export { errors };
