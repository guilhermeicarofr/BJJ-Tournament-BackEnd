import { errors } from 'errors/errors';
import { getAthleteClasses } from './athlete-services';
import { athleteRepository } from 'repositories/athlete-repository';
import { eventsRepository } from 'repositories/events-repository';
import { registrationsRepository } from 'repositories/registrations-repository';
import { categoriesRepository } from 'repositories/categories-repository';

export async function listAthleteEventRegistration(userId: number, eventId: number) {
  const event = await eventsRepository.findById(eventId);
  if(!event) throw errors.notFoundError();

  const registrations = await registrationsRepository.findAllFromUserByEvent(userId, eventId);
  return registrations;
}

export async function createAthleteRegistration(userId: number, eventId: number, absolute: string) {
  const event = await eventsRepository.findById(eventId);
  if(!event) throw errors.notFoundError();

  const athlete = await athleteRepository.findUserInfo(userId);
  const classes = await getAthleteClasses(athlete);

  const registrationCategory = {
    eventId,
    male: classes.male,
    belt: classes.belt.id,
    absolute: (absolute === 'true')?true:false,
    ageClass: classes.ageClass.id,
    weightClass: classes.weightClass.id
  };

  let registration = null;

  const checkCategory = await categoriesRepository.findByInfo(registrationCategory);
  if(checkCategory) {
    registration = await registrationsRepository.create(userId, checkCategory.id);
  } else {
    const newCategory = await categoriesRepository.create(registrationCategory);
    registration = await registrationsRepository.create(userId, newCategory.id);
  }

  if(!registration) throw errors.conflictError('registration failed, conflicting information');
  return;
}
