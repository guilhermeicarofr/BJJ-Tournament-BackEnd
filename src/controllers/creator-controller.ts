import { event } from "@prisma/client";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";
import { AuthRequest } from "protocols/types";
import { closeEvent, createNewEvent, finishEvent, listCreatorEvents } from "services/creator-services";

export async function getCreatedEvents(req: AuthRequest, res: Response, next: NextFunction) {
  const { userId } = req.auth;
  try {
    const events = await listCreatorEvents(userId);
    return res.status(httpStatus.OK).send(events);      
  } catch (error) {
    return next();
  }
}

export async function postNewEvent(req: AuthRequest, res: Response, next: NextFunction) {
  const { userId } = req.auth;
  const data = req.body as Partial<event>;

  try {
    const event = await createNewEvent(userId, data);
    return res.status(httpStatus.CREATED).send(event);
  } catch (error) {
    return next();
  }
}

export async function putEventClosed(req: AuthRequest, res: Response, next: NextFunction) {
  const { userId } = req.auth;
  const { eventId } = req.params;

  try {
    await closeEvent(userId, Number(eventId));
    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    if(error.name === 'NotAllowed') return res.status(httpStatus.FORBIDDEN).send(error.message);
    if(error.name === 'Conflict') return res.status(httpStatus.CONFLICT).send(error.message);
    if(error.name === 'NotFound') return res.status(httpStatus.NOT_FOUND).send(error.message);
    return next();
  }
}

export async function putEventFinished(req: AuthRequest, res: Response, next: NextFunction) {
  const { userId } = req.auth;
  const { eventId } = req.params;

  try {
    await finishEvent(userId, Number(eventId));
    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    if(error.name === 'NotAllowed') return res.status(httpStatus.FORBIDDEN).send(error.message);
    if(error.name === 'Conflict') return res.status(httpStatus.CONFLICT).send(error.message);
    if(error.name === 'NotFound') return res.status(httpStatus.NOT_FOUND).send(error.message);
    return next();
  }
}
