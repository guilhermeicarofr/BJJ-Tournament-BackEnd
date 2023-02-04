import express from 'express';

import { validateAuthToken, validateSchema } from 'middlewares/validation-middlewares';
import { getAthleteInfo, postAthleteInfo } from 'controllers/athlete-controller';
import { schemas } from 'schemas/schemas';

const athleteRouter = express.Router();

athleteRouter
  .use('/*', validateAuthToken)
  .get('/info', getAthleteInfo) //not tested
  .post('/info', validateSchema(schemas.athleteInfoForm, 'body'), postAthleteInfo); //not tested

export { athleteRouter };
