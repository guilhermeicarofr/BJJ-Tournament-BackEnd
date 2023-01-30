import { NextFunction, Response } from "express";
import httpStatus from "http-status";
import { AuthRequest } from "protocols/types";
import { listCreatorEvents } from "services/creator-services";

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
  
  try {
    
  } catch (error) {
    return next();
  }
}
