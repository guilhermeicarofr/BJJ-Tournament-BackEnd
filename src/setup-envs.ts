import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

export function loadEnv() {
  let path = '';
  switch (process.env.NODE_ENV) {
  case('test'): path = '.env.test'; break;
  case('dev'): path = '.env.dev'; break;
  case('prod'): path = '.env.prod'; break;
  case('local'): path = '.env.local'; break;
  default: break;
  }

  const currentEnvs = dotenv.config({ path });
  dotenvExpand.expand(currentEnvs);
}
