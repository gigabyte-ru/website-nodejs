import { redis } from './utils';

import {
  createClient,
  SchemaFieldTypes,
  AggregateGroupByReducers,
  AggregateSteps,
} from 'redis';
import { Articles, Langs } from './classes';

const langs = new Langs();
const articles = new Articles();

(async () => {
  const findLang1 = await langs.lib.get(1);
  const findLang2 = await langs.lib.get(53);

  const findSearchLang1 = await articles.getTranslation(2, 266247);
  const findSearchLang2 = await articles.getTranslation(
    43,
    'you_have_been_registered_on_gigabyte_website'
  );
  const findSearchLang3 = await langs.lib.search('@alias:by');
  const findSearchLang4 = await langs.lib.search('@alias:en uk');
  const findSearchLang5 = await langs.lib.search('@alias:he');

  console.log({
    findSearchLang1,
    findSearchLang2,
    findSearchLang3,
    findSearchLang4,
    findSearchLang5,
  });

  await redis.quit();
})();
