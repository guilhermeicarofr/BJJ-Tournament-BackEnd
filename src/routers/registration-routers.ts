import express from 'express';

import { getEventUserRegistrations, postUserRegistration } from 'controllers/registrations-controller';
import { validateAuthToken, validateSchema } from 'middlewares/validation-middlewares';
import { schemas } from 'schemas/schemas';

const registrationRouter = express.Router();

registrationRouter
  .use('/*', validateAuthToken)
  .get('/event/:eventId', validateSchema(schemas.idParam('eventId'), 'params'), getEventUserRegistrations)
  .post('/event/:eventId', validateSchema(schemas.idParam('eventId'), 'params'), postUserRegistration);

export { registrationRouter };
