import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';

import { AuthRequest } from 'protocols/types';
import { listAthleteInfo } from 'services/athlete-services';

export async function getAthleteInfo(req: AuthRequest, res: Response, next: NextFunction) {
  const { userId } = req.auth;

  try {
    const athlete = await listAthleteInfo(userId);
    return res.status(httpStatus.OK).send(athlete);
  } catch (error) {
    if(error.name === 'NotFound') return res.status(httpStatus.NOT_FOUND).send(error.message);
    return next();
  }
}
