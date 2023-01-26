import joi from 'joi';

const athleteInputSchema = joi.object({
  name: joi.string().required(),
  weight: joi.number().required(),
  age: joi.number().integer().required(),
  belt: joi.number().integer().min(1).max(5).required(),
  team: joi.string().required()
});

export { athleteInputSchema };
