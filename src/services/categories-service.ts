import { listEventInfo } from './events-services';
import { categoriesRepository } from 'repositories/categories-repository';
import { fightsRepository } from 'repositories/fights-repository';
import { errors } from 'errors/errors';
import { registrationsRepository } from 'repositories/registrations-repository';

export async function listEventCategories(eventId: number) {
  await listEventInfo(eventId);
  const categories = await categoriesRepository.findAllByEvent(eventId);
  return categories;
}

export async function listCategoryFights(categoryId: number) {
  const category = categoriesRepository.findById(categoryId);
  if(!category) throw errors.notFoundError();
  
  const fights = await fightsRepository.findAllByCategory(categoryId);
  return fights;
}

export async function listCategoryAthletes(categoryId: number) {
  const category = categoriesRepository.findById(categoryId);
  if(!category) throw errors.notFoundError();
  
  const athletes = await registrationsRepository.findAllByCategory(categoryId);
  return athletes;
}

export async function listCategoryPodium(categoryId: number) {
  const category = categoriesRepository.findById(categoryId);
  if(!category) throw errors.notFoundError();
  
  let first = null;
  let second = null;
  let third = null;

  const final = await fightsRepository.findFinalByCategory(categoryId);

  if(final.athlete1 === final.winner) {
    first = {
      id: final.athlete1,
      name: final.users_fights_athlete1Tousers.name,
    };
    second = {
      id: final.athlete2,
      name: final.users_fights_athlete2Tousers.name
    };
    const otherFight = await fightsRepository.findById(final.previousFight1);
    if(otherFight.athlete1 === final.winner) {
      third = {
        id: otherFight.athlete2,
        name: otherFight.users_fights_athlete2Tousers,
      };
    } else if(otherFight.athlete2 === final.winner) {
      third = {
        id: otherFight.athlete1,
        name: otherFight.users_fights_athlete1Tousers,
      };
    }
  }

  if(final.athlete2 === final.winner) {
    first = {
      id: final.athlete2,
      name: final.users_fights_athlete2Tousers.name,
    };
    second = {
      id: final.athlete1,
      name: final.users_fights_athlete1Tousers.name
    };
    const otherFight = await fightsRepository.findById(final.previousFight2);
    if(otherFight.athlete1 === final.winner) {
      third = {
        id: otherFight.athlete2,
        name: otherFight.users_fights_athlete2Tousers,
      };
    } else if(otherFight.athlete2 === final.winner) {
      third = {
        id: otherFight.athlete1,
        name: otherFight.users_fights_athlete1Tousers,
      };
    }
  }

  return {
    first, second, third
  };
}
