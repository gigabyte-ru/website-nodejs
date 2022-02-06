'use strict';

import { GlobalVariablesParser } from './classes';
import { redis } from './utils';

const globalVariablesParser = new GlobalVariablesParser();
await globalVariablesParser.init();

redis.quit().then();
