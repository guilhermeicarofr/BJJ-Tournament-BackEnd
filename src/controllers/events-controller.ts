import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { FilterQuery } from 'protocols/types';
import { listEvents } from 'services/events-services';

export async function getEvents(req: Request, res: Response) {
  const { filter } = req.query as FilterQuery;
  
  const events = await listEvents(filter);
  return res.status(httpStatus.OK).send(events);
}
