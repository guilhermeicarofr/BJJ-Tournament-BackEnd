import { listEventInfo } from './events-services';
import { categoriesRepository } from 'repositories/categories-repository';
import { fightsRepository } from 'repositories/fights-repository';
import { errors } from 'errors/errors';

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
