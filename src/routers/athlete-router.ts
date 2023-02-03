import express from 'express';

import { validateAuthToken } from 'middlewares/validation-middlewares';
import { getAthleteInfo } from 'controllers/athlete-controllers';

const athleteRouter = express.Router();

athleteRouter
  .use('/*', validateAuthToken)
  .get('/info', getAthleteInfo);
//.post('/info', validateSchema(,'body'), postAthleteInfo);

export { athleteRouter };
