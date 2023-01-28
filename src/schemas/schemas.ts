import joi from 'joi';

const signUp = joi.object({
  name: joi.string().required().max(250).trim(),
  cpf: joi.string().length(11).required(),
  email: joi.string().email().required().max(100).trim(),
  password: joi.string().required().max(50).min(4).trim(),
});

const signIn = joi.object({
  email: joi.string().email().required().max(100).trim(),
  password: joi.string().required().max(50).min(4).trim(),
});

const idParam = (idName: string) => {
  return joi.object({
    [idName]: joi.number().integer().min(1).required()
  });
};

const schemas = {
  signUp,
  signIn,
  idParam
};

export { schemas };
