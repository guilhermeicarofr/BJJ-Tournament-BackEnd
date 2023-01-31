import { ApplicationError } from 'protocols/types';

function signUpError(message: string): ApplicationError {
  return {
    name: 'InvalidSignUp',
    message
  };
}

function signInError(): ApplicationError {
  return {
    name: 'InvalidSignIn',
    message: 'Invalid credentials'
  };
}

function notFoundError(): ApplicationError {
  return {
    name: 'NotFound',
    message: 'Entity not found'
  };
}

function notAllowedError(): ApplicationError {
  return {
    name: 'NotAllowed',
    message: 'Invalid Permissions'
  };
}

function conflictError(message: string): ApplicationError {
  return {
    name: 'Conflict',
    message
  };
}

const errors = {
  signUpError,
  signInError,
  notFoundError,
  notAllowedError,
  conflictError
};

export { errors };
