import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { FilterQuery } from 'protocols/types';
import { listEventInfo, listEvents } from 'services/events-services';

export async function getEvents(req: Request, res: Response) {
  const { filter } = req.query as FilterQuery;
  
  const events = await listEvents(filter);
  return res.status(httpStatus.OK).send(events);
}

export async function getEventInfo(req: Request, res: Response) {
  const { eventId } = req.params;

  try {
    const event = await listEventInfo(Number(eventId));
    return res.status(httpStatus.OK).send(event);
  } catch (error) {
    if(error.name === 'NotFound') return res.status(httpStatus.NOT_FOUND).send(error.message);
  }
}
