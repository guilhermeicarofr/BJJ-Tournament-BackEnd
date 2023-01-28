import { getEventInfo, getEvents } from 'controllers/events-controller';
import { Router } from 'express';
import { validateSchema } from 'middlewares/validation-middlewares';
import { schemas } from 'schemas/schemas';

const eventsRouter = Router();

eventsRouter
  .get('/list', getEvents)
  .get('open/:eventId', validateSchema(schemas.idParam('eventId'), 'params'), getEventInfo);

export { eventsRouter };
