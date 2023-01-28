import { eventsRepository } from "repositories/events-repository";

export async function listEvents(filter: string) {
  if(filter === 'open') return await eventsRepository.findOpen();
  if(filter === 'closed')  return await eventsRepository.findOpen();
  if(filter === 'finished') return await eventsRepository.findOpen();
  return await eventsRepository.findAll();
}