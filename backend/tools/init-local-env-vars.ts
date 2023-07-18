#!/usr/bin/env ts-node

import { resolve } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import * as chalk from 'chalk';

// resolve(.) resolve backend/
const defaultEnvConfigFile = resolve('config', 'env.local.txt');
const envFile = resolve('.env');
const log = console.log;

// ---------------------------------------------------------------
log(chalk.yellow('--Launching init-local-env-var script--'));

log(chalk.blueBright('  Setting up .env file from config'));
log(chalk.blueBright(`  ${defaultEnvConfigFile} => ${envFile}`));
readFile(defaultEnvConfigFile).then((content: Buffer) => writeFile(envFile, content));

log(chalk.yellow('--Done executing init-local-env-var script--'));
