import { getEvents } from 'controllers/events-controller';
import { Router } from 'express';

const eventsRouter = Router();

eventsRouter.get('/list', getEvents);

export { eventsRouter };
