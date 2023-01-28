import { TournamentClasses } from 'protocols/types';

export async function getClasses() {
  const classes = await require('./tournament-classes.json') as TournamentClasses;
  return classes;
}
