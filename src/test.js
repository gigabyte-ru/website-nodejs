import { redis } from './utils';

import {
  createClient,
  SchemaFieldTypes,
  AggregateGroupByReducers,
  AggregateSteps,
} from 'redis';
import { Langs } from './classes';

const langs = new Langs();

(async () => {
  const findLang1 = await langs.lib().get(1);
  const findLang2 = await langs.lib().get(53);

  const findSearchLang1 = await langs
    .lib()
    .search(langs.indexLibKey, '@alias:tj');
  const findSearchLang2 = await langs
    .lib()
    .search(langs.indexLibKey, '@alias:kg');
  const findSearchLang3 = await langs
    .lib()
    .search(langs.indexLibKey, '@alias:nl');
  const findSearchLang4 = await langs
    .lib()
    .search(langs.indexLibKey, '@alias:en uk');
  const findSearchLang5 = await langs
    .lib()
    .search(langs.indexLibKey, '@alias:he');

  console.log({
    findSearchLang1,
    findSearchLang2,
    findSearchLang3,
    findSearchLang4,
    findSearchLang5,
  });

  await redis.quit();
})();
