'use strict';

import { GlobalVariables } from './classes/GlobalVariables';
import { redis } from './utils';

const globalVariables = new GlobalVariables();
await globalVariables.clearStorage();
await globalVariables.createIndexes();
await globalVariables.init();

redis.quit().then();
