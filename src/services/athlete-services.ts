import { athleteInfo } from '@prisma/client';

import { errors } from 'errors/errors';
import { athleteRepository } from 'repositories/athlete-repository';
import { getClasses } from 'utils/get-local';

export async function getAthleteClasses(info: athleteInfo) {
  const classesChart = await getClasses();

  let belt = null;
  for(let i=0; i<classesChart.belts.length; i++) {
    if(info.belt === classesChart.belts[i].id) {
      belt = {
        id: classesChart.belts[i].id,
        name: classesChart.belts[i].name
      };
    }
  }
  
  let ageClass = null;
  for(let i=0; i<classesChart.ageClasses.length; i++) {
    if(info.age >= classesChart.ageClasses[i].min && info.age <= classesChart.ageClasses[i].min) {
      ageClass = {
        id: classesChart.ageClasses[i].id,
        name: classesChart.ageClasses[i].name
      };
    }
  }
  
  let weightClass = null;
  if(info.male) {
    for(let i=0; i<classesChart.weigthClasses.male.length; i++) {
      if(info.weight >= classesChart.weigthClasses.male[i].min && info.weight <= classesChart.weigthClasses.male[i].max) {
        weightClass = {
          id: classesChart.weigthClasses.male[i].id,
          name: classesChart.weigthClasses.male[i].name
        };
      }
    }
  } else if(!info.male) {
    for(let i=0; i<classesChart.weigthClasses.female.length; i++) {
      if(info.weight >= classesChart.weigthClasses.female[i].min && info.weight <= classesChart.weigthClasses.female[i].max) {
        weightClass = {
          id: classesChart.weigthClasses.female[i].id,
          name: classesChart.weigthClasses.female[i].name
        };
      }
    }
  }

  return {
    ageClass,
    male: info.male,
    weightClass,
    belt
  };
}

export async function listAthleteInfo(userId: number) {
  const info = await athleteRepository.findUserInfo(userId);
  if(!info) throw errors.notFoundError();

  const classes = await getAthleteClasses(info);
  return {
    info,
    classes
  };
}
