import { eventsRepository } from "repositories/events-repository";

export async function listCreatorEvents(userId: number) {
  const events = await eventsRepository.findByCreator(userId);
  return events;
}
