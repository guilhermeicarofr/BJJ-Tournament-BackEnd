import { getCreatedEvents, postNewEvent, putEventClosed } from 'controllers/creator-controller';
import { Router } from 'express';

import { validateAuthToken, validateSchema } from 'middlewares/validation-middlewares';
import { schemas } from 'schemas/schemas';

const creatorRouter = Router();

creatorRouter
  .use('/*', validateAuthToken)
  .get('/events', getCreatedEvents)
  .post('/events', validateSchema(schemas.newEvent, 'body'), postNewEvent)
  .put('/events/:eventId/close', validateSchema(schemas.idParam('eventId'), 'params'), putEventClosed)
//.middleware to check event ownership
//.put('/events/:eventId/start'
//.put('/events/:eventId/finish')

export { creatorRouter };
