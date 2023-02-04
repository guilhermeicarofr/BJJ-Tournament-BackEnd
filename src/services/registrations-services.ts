import { errors } from 'errors/errors';
import { eventsRepository } from 'repositories/events-repository';
import { registrationsRepository } from 'repositories/registrations-repository';

export async function listAthleteEventRegistration(userId: number, eventId: number) {
  const event = await eventsRepository.findById(eventId);
  if(!event) throw errors.notFoundError();

  const registrations = await registrationsRepository.findAllFromUserByEvent(userId, eventId);
  return registrations;
}