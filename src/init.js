'use strict';

import { GlobalVariables } from './classes';
import { redis } from './utils';

const globalVariablesParser = new GlobalVariables();
//await globalVariablesParser.clearStorage();
await globalVariablesParser.createIndexes();
//await globalVariablesParser.init();

redis.quit().then();
