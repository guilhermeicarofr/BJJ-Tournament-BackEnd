import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';

import { AbsoluteQuery, AuthRequest } from 'protocols/types';
import { createAthleteRegistration, listAthleteEventRegistration } from 'services/registrations-services';

export async function getEventUserRegistrations(req: AuthRequest, res: Response, next: NextFunction) {
  const { userId } = req.auth;
  const { eventId } = req.params;

  try {
    const registrations = await listAthleteEventRegistration(userId, Number(eventId));
    return res.status(httpStatus.OK).send(registrations);
  } catch (error) {
    if(error.name === 'NotFound') return res.status(httpStatus.NOT_FOUND).send(error.message);
    return next();
  }
}

export async function postUserRegistration(req: AuthRequest, res: Response, next: NextFunction) {
  const { userId } = req.auth;
  const { eventId } = req.params;
  const { absolute } = req.query as AbsoluteQuery;

  try {
    await createAthleteRegistration( userId, Number(eventId), absolute);
    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    if(error.name === 'NotFound') return res.status(httpStatus.NOT_FOUND).send(error.message);
    return next();
  }
}
