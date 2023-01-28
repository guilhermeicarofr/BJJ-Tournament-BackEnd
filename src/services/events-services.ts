import { errors } from 'errors/errors';
import { eventsRepository } from 'repositories/events-repository';

export async function listEvents(filter: string) {
  if(filter === 'open') return await eventsRepository.findOpen();
  if(filter === 'closed')  return await eventsRepository.findClosed();
  if(filter === 'finished') return await eventsRepository.findFinished();
  return await eventsRepository.findAll();
}

export async function listEventInfo(eventId: number) {
  const event = await eventsRepository.findById(eventId);
  if(!event) throw errors.notFoundError();
  return event;
}
