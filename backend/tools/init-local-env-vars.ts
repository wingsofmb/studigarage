#!/usr/bin/env ts-node

import { resolve } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import * as chalk from 'chalk';

// resolve(.) resolve backend/
const defaultEnvConfigFile = resolve('config', 'env.local.txt');
const prismaEnvFile = resolve('.env');
const log = console.log;

// ---------------------------------------------------------------
log(chalk.yellow('--Launching init-local-db script--'));

log(chalk.blueBright('  Setting up .env file from config'));
log(chalk.blueBright(`  ${defaultEnvConfigFile} => ${prismaEnvFile}`));
readFile(defaultEnvConfigFile).then((content: Buffer) => writeFile(prismaEnvFile, content));

log(chalk.yellow('--Done executing init-local-db script--'));
