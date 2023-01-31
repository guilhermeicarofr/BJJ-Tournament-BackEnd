import { event } from "@prisma/client";
import { eventsRepository } from "repositories/events-repository";

export async function listCreatorEvents(userId: number) {
  const events = await eventsRepository.findByCreator(userId);
  return events;
}

export async function createNewEvent(userId: number, data: Partial<event>) {
  const event = await eventsRepository.create(userId, data);
  return event;
}
