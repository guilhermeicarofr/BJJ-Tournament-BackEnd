import { event } from "@prisma/client";
import { errors } from "errors/errors";
import { eventsRepository } from "repositories/events-repository";

async function checkEventOwner(userId: number, eventId: number) {
  const event = await eventsRepository.findById(eventId);
  if(event.createdBy !== userId) throw errors.notAllowedError();
  return event;
}

export async function listCreatorEvents(userId: number) {
  const events = await eventsRepository.findByCreator(userId);
  return events;
}

export async function createNewEvent(userId: number, data: Partial<event>) {
  const event = await eventsRepository.create(userId, data);
  return event;
}

export async function closeEvent(userId: number, eventId: number) {
  const event = await checkEventOwner(userId, eventId);  
  if(!event.open || event.finished) throw errors.conflictError('event status conflicts with request');
  await eventsRepository.close(eventId);
  return;
}

export async function finishEvent(userId: number, eventId: number) {
  const event = await checkEventOwner(userId, eventId);  
  if(event.open || event.finished) throw errors.conflictError('event status conflicts with request');
  await eventsRepository.finish(eventId);
  return;
}
