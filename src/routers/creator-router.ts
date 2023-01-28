import { getCreatedEvents } from 'controllers/creator-controller';
import { Router } from 'express';

import { validateAuthToken } from 'middlewares/validation-middlewares';

const creatorRouter = Router();

creatorRouter
  .use('/*', validateAuthToken)
  .get('/events', getCreatedEvents);
//.post('/events', postNewEvent)
//middleware to check event ownership
//.put('/events/:eventId/close')
//.put('/events/:eventId/run')
//.put('/events/:eventId/finish')

export { creatorRouter };
