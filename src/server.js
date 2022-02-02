'use strict';

import { Worker, workerData, isMainThread } from 'worker_threads';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { GlobalVariablesParser } from './classes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const globalVariablesParser = new GlobalVariablesParser();

await globalVariablesParser.init();

new Worker(`${__dirname}/worker.js`, {
  workerData: globalVariablesParser.classes,
});

globalVariablesParser.runUpdate();
