import { getCreatedEvents, postEventFights, postNewEvent, putEventClosed, putEventFinished, putFightWinner } from 'controllers/creator-controller';
import { Router } from 'express';

import { validateAuthToken, validateSchema } from 'middlewares/validation-middlewares';
import { schemas } from 'schemas/schemas';

const creatorRouter = Router();

creatorRouter
  .use('/*', validateAuthToken)
  .get('/events', getCreatedEvents)
  .post('/events', validateSchema(schemas.newEvent, 'body'), postNewEvent)
  .put('/events/:eventId/close', validateSchema(schemas.idParam('eventId'), 'params'), putEventClosed)
  .put('/events/:eventId/finish', validateSchema(schemas.idParam('eventId'), 'params'), putEventFinished)
  .post('/events/:eventId/fights', validateSchema(schemas.idParam('eventId'), 'params'), postEventFights)
  .put('/fights/:fightId', validateSchema(schemas.idParam('fightId'), 'params'), validateSchema(schemas.idParam('winnerId'), 'body'), putFightWinner);

export { creatorRouter };
