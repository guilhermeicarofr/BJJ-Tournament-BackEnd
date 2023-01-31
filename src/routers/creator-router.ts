import { getCreatedEvents, postNewEvent } from 'controllers/creator-controller';
import { Router } from 'express';

import { validateAuthToken, validateSchema } from 'middlewares/validation-middlewares';
import { schemas } from 'schemas/schemas';

const creatorRouter = Router();

creatorRouter
  .use('/*', validateAuthToken)
  .get('/events', getCreatedEvents)
  .post('/events', validateSchema(schemas.newEvent, 'body'), postNewEvent)
//.middleware to check event ownership
//.put('/events/:eventId/close')
//.put('/events/:eventId/run')
//.put('/events/:eventId/finish')

export { creatorRouter };
