import { Response } from "express";
import httpStatus from "http-status";
import { AuthRequest } from "protocols/types";
import { listCreatorEvents } from "services/creator-services";

export async function getCreatedEvents(req: AuthRequest, res: Response) {
  const { userId } = req.auth;

  const events = await listCreatorEvents(userId);
  return res.status(httpStatus.OK).send(events);
}
