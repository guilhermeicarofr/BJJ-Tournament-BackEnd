import { getCategoryAthletes, getCategoryFights, getCategoryPodium, getEventCategories, getEventInfo, getEvents } from 'controllers/events-controller';
import { Router } from 'express';
import { validateSchema } from 'middlewares/validation-middlewares';
import { schemas } from 'schemas/schemas';

const eventsRouter = Router();

eventsRouter
  .get('/list', getEvents)
  .get('/open/:eventId', validateSchema(schemas.idParam('eventId'), 'params'), getEventInfo)
  .get('/open/:eventId/categories', validateSchema(schemas.idParam('eventId'), 'params'), getEventCategories) //not tested
  .get('/category/:categoryId/athletes', validateSchema(schemas.idParam('categoryId'), 'params'), getCategoryAthletes) //not tested
  .get('/category/:categoryId/fights', validateSchema(schemas.idParam('categoryId'), 'params'), getCategoryFights) //not tested
  .get('/category/:categoryId/podium', validateSchema(schemas.idParam('categoryId'), 'params'), getCategoryPodium); //not tested

export { eventsRouter };
