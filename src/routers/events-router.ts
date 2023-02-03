import { getCategoryFights, getEventCategories, getEventInfo, getEvents } from 'controllers/events-controller';
import { Router } from 'express';
import { validateSchema } from 'middlewares/validation-middlewares';
import { schemas } from 'schemas/schemas';

const eventsRouter = Router();

eventsRouter
  .get('/list', getEvents)
  .get('/open/:eventId', validateSchema(schemas.idParam('eventId'), 'params'), getEventInfo)
  .get('/open/:eventId/categories', validateSchema(schemas.idParam('eventId'), 'params'), getEventCategories)
  .get('/category/:categoryId', validateSchema(schemas.idParam('categoryId'), 'params'), getCategoryFights);

export { eventsRouter };
