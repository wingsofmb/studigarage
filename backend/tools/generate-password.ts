#!/usr/bin/env ts-node

import { hashSync } from 'bcrypt';
import * as chalk from 'chalk';

// resolve(.) resolve backend/
// const defaultEnvConfigFile = resolve('config', 'env.local.txt');
// const prismaEnvFile = resolve('.env');
const log = console.log;
const hashPassword = (password: string): string => {
  return hashSync(password, 10);
};

// ---------------------------------------------------------------
log(chalk.yellow('--Launching generate-password script--'));

if (!process.argv[2] || process.argv[3]) {
  log(chalk.red('  You must provide one argument, and one only (a password) through CLI'));
  log(chalk.red('  yarn run generate-pwd <mymostsecretpassword>'));
  log(chalk.red('  npm run generate-pwd <mymostsecretpassword>'));
  throw new Error('Wrong CLI usage');
}

const hashedPwd = hashPassword(process.argv[2]);

if (hashedPwd) {
  log(chalk.green(`  ${hashedPwd}`));
} else {
  throw new Error('something went wrong, sorry');
}

log(chalk.yellow('--Done executing generate-password script--'));
