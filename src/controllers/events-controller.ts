import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import { FilterQuery } from 'protocols/types';
import { listCategoryAthletes, listCategoryFights, listCategoryPodium, listEventCategories } from 'services/categories-service';
import { listEventInfo, listEvents } from 'services/events-services';
import { getClasses } from 'utils/get-local';

export async function getEvents(req: Request, res: Response, next: NextFunction) {
  const { filter } = req.query as FilterQuery;
  
  try {
    const events = await listEvents(filter);
    return res.status(httpStatus.OK).send(events);    
  } catch (error) {
    return next();
  }
}

export async function getEventInfo(req: Request, res: Response, next: NextFunction) {
  const { eventId } = req.params;

  try {
    const event = await listEventInfo(Number(eventId));
    const classes = await getClasses();
    return res.status(httpStatus.OK).send({ event, classes });
  } catch (error) {
    if(error.name === 'NotFound') return res.status(httpStatus.NOT_FOUND).send(error.message);
    return next();
  }
}

export async function getEventCategories(req: Request, res: Response, next: NextFunction) {
  const { eventId } = req.params;

  try {
    const categories = await listEventCategories(Number(eventId));
    return res.status(httpStatus.OK).send(categories);
  } catch (error) {
    if(error.name === 'NotFound') return res.status(httpStatus.NOT_FOUND).send(error.message);
    return next();
  }
}

export async function getCategoryFights(req: Request, res: Response, next: NextFunction) {
  const { categoryId } = req.params;

  try {
    const fights = await listCategoryFights(Number(categoryId));
    return res.status(httpStatus.OK).send(fights);
  } catch (error) {
    if(error.name === 'NotFound') return res.status(httpStatus.NOT_FOUND).send(error.message);
    return next();
  }
}

export async function getCategoryAthletes(req: Request, res: Response, next: NextFunction) {
  const { categoryId } = req.params;

  try {
    const athletes = await listCategoryAthletes(Number(categoryId));
    return res.status(httpStatus.OK).send(athletes);
  } catch (error) {
    if(error.name === 'NotFound') return res.status(httpStatus.NOT_FOUND).send(error.message);
    return next();
  }
}

export async function getCategoryPodium(req: Request, res: Response, next: NextFunction) {
  const { categoryId } = req.params;

  try {
    const podium = await listCategoryPodium(Number(categoryId));
    return res.status(httpStatus.OK).send(podium);
  } catch (error) {
    if(error.name === 'NotFound') return res.status(httpStatus.NOT_FOUND).send(error.message);
    return next();
  }
}
