import express from 'express';

import { validateAuthToken, validateSchema } from 'middlewares/validation-middlewares';
import { getAthleteInfo, postAthleteInfo } from 'controllers/athlete-controllers';
import { schemas } from 'schemas/schemas';

const athleteRouter = express.Router();

athleteRouter
  .use('/*', validateAuthToken)
  .get('/info', getAthleteInfo)
  .post('/info', validateSchema(schemas.athleteInfoForm,'body'), postAthleteInfo);

export { athleteRouter };
