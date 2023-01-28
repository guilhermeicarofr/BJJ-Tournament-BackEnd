import { Router } from 'express';

import { validateAuthToken, validateSchema } from 'middlewares/validation-middlewares';
import { schemas } from 'schemas/schemas';

const creatorRouter = Router();

creatorRouter
  .all('/', validateAuthToken);
  //.get('/events', getCreatedEvents)
  //.post('/events', postNewEvent)
  //.put('/events/:eventId/close')
  //.put('/events/:eventId/run')
  //.put('/events/:eventId/finish')

export { creatorRouter };
