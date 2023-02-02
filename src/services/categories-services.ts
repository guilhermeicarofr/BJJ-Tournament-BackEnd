import { listEventInfo } from "./events-services";
import { categoriesRepository } from 'repositories/categories-repository';
import { categories } from "@prisma/client";
import { registrationsRepository } from "repositories/registrations-repository";
import { fightsRepository } from "repositories/fights-repository";

function calcRoundSkippers(nCompetitors: number) {
  let nRounds = 0;
  let nSkippers = 0;

  for(let i=1; nCompetitors >= 2**(i); i++) {  
    if(nCompetitors === 2**(i)) {
      nSkippers = 0;
      nRounds = i;
    }
    if(nCompetitors > 2**(i) && nCompetitors < 2**(i+1)) {
      nSkippers = 2**(i+1) - nCompetitors;
      nRounds = i+1;
    }
  }

  return {
    nRounds,
    nSkippers
  };
}

function chooseNRandomIndexes(n: number, range: number) {
  let indexes = [] as number[];

  while (indexes.length < n) {
    let random = Math.floor(Math.random() * (range));
    if (!indexes.includes(random)) {
      indexes.push(random);
    }
  }

  return { indexes };
}

export async function listEventCategories(eventId: number) {
  await listEventInfo(eventId);
  const categories = await categoriesRepository.findAllByEvent(eventId);
  return categories;
}

export async function createCategoryFights(categoryId: number) {
  const fighters = await registrationsRepository.findAllByCategory(categoryId);
  const nCompetitors = fighters.length;
  
  if(!nCompetitors) return;

  //if there is only one competitor, final fight is set and finished with victory
  if(nCompetitors === 1) {
    await fightsRepository.create({
      categoryId,
      round: 1,
      final: true,
      previousFight1: null,
      previousFight2: null,
      athlete1: fighters[0].id,
      athlete2: null,
      winner: fighters[0].id
    });
    return;
  }

  //calculating and sorting fighters that will skip the first round fight, if any
  const { nRounds, nSkippers } = calcRoundSkippers(nCompetitors);
  const { indexes } = chooseNRandomIndexes(nSkippers, nCompetitors)
  const firstRoundSkippers = fighters.filter((fighter, index) => indexes.includes(index));  

  //calculating fighters that will fight the first round fights
  const firstRoundFighters = fighters.filter((fighter, index) => !indexes.includes(index));

  //creating first round fights
  for(let i=0; i<firstRoundFighters.length-1; i += 2) {
    await fightsRepository.create({
      categoryId,
      round: 1,
      final: (nRounds === 1),
      previousFight1: null,
      previousFight2: null,
      athlete1: firstRoundFighters[i].userId,
      athlete2: firstRoundFighters[i+1].userId,
      winner: null
    });
  }

  //getting first round fights from database
  const firstRoundFights = await fightsRepository.findCategoryRoundFights(categoryId, 1);

  //generate second round including first round skippers on tournament
  //now every second round fight is guarateed to form a matching tournament bracket
  let f = 0;
  let a = 0;
  while(f < firstRoundFights.length || a < firstRoundSkippers.length) {
    let fight1 = null;
    let fight2 = null;
    let athlete1 = null;
    let athlete2 = null;

    if(f<firstRoundFights.length) fight1 = firstRoundFights[f];
    if(f+1<firstRoundFights.length) fight2 = firstRoundFights[f+1];

    if(!fight1 && a<firstRoundSkippers.length) {
      athlete1 = firstRoundSkippers[a];
      a++;
    }
    if(!fight2 && a<firstRoundSkippers.length) {
      athlete2 = firstRoundSkippers[a];
      a++;
    }

    if(!fight1 && !fight2 && !athlete1 && !athlete2) break;

    await fightsRepository.create({
      categoryId,
      round: 2,
      final: (nRounds === 2),
      previousFight1: fight1.id || null,
      previousFight2: fight2.id || null,
      athlete1: athlete1.id || null,
      athlete2: athlete2.id || null,
      winner: null
    });

    f = f+2;
  }

  //now with normalized for 2^n number of fights, get last round fights and generate next up to the final
  for(let round = 3; round<=nRounds; round++) {
    const lastRoundFights = await fightsRepository.findCategoryRoundFights(categoryId, round-1);
    for(let i=0; i<lastRoundFights.length-1; i+= 2) {
      await fightsRepository.create({
        categoryId,
        round: round,
        final: (round === nRounds),
        previousFight1: lastRoundFights[i].id,
        previousFight2: lastRoundFights[i+1].id,
        athlete1: null,
        athlete2: null,
        winner: null
      });  
    }
  }
  return;
}