import { event } from '@prisma/client';

import { errors } from 'errors/errors';
import { categoriesRepository } from 'repositories/categories-repository';
import { eventsRepository } from 'repositories/events-repository';
import { fightsRepository } from 'repositories/fights-repository';
import { userRepository } from 'repositories/user-repository';
import { listEventCategories } from './categories-services';
import { createCategoryFights } from './creator-fights-services';

async function checkEventOwner(userId: number, eventId: number) {
  const event = await eventsRepository.findById(eventId);
  if(!event) throw errors.notFoundError();
  if(event.createdBy !== userId) throw errors.notAllowedError();
  return event;
}

async function checkFinishedFights(eventId: number) {
  const fights = await fightsRepository.findAllNotFinishedInEvent(eventId);
  if(fights.length) throw errors.conflictError('there are still fights to be finished');

  const categories = await categoriesRepository.findAllByEvent(eventId);
  const finals = await fightsRepository.findAllFinalsInEvent(eventId);
  if(categories.length !== finals.length) throw errors.conflictError('there are categories without final fights');
  return;
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
  await checkFinishedFights(eventId);

  await eventsRepository.finish(eventId);
  return;
}

export async function runEventFights(userId: number, eventId: number) {
  const event = await checkEventOwner(userId, eventId);  
  if(event.open || event.finished) throw errors.conflictError('event status conflicts with request');

  const categories = await listEventCategories(eventId);
  const created = [] as number[];
  for(let i=0; i<categories.length; i++) {
    const status = await createCategoryFights(categories[i].id);
    if(status) created.push(categories[i].id);
  }

  return created;
}

export async function setFightWinner({ userId, fightId, winnerId }: { userId: number, fightId: number, winnerId: number }) {
  const fight = await fightsRepository.findById(fightId);

  if(!fight) throw errors.notFoundError();
  if(fight.categories.event.createdBy !== userId) throw errors.notAllowedError();

  const fighter = await userRepository.findById(winnerId);
  if(!fighter) throw errors.notFoundError();

  if(fight.winner) throw errors.conflictError('fight already has a winner');
  if(!fight.athlete1 || !fight.athlete2) throw errors.conflictError('winner cannot be set before fight is arranged');
  if(fight.athlete1 !== winnerId && fight.athlete2 !== winnerId) throw errors.conflictError('winner is not one of the fighters');

  await fightsRepository.updateWinner(fightId, winnerId);

  if(fight.final) return;

  const nextFight = await fightsRepository.findNextFight(fightId);
  if(nextFight.previousFight1 === fightId) await fightsRepository.updatePrevFight({ fightId: nextFight.id, prev: 'athlete1', winnerId });
  if(nextFight.previousFight1 === fightId) await fightsRepository.updatePrevFight({ fightId: nextFight.id, prev: 'athlete2', winnerId });
  
  return;
}
