import { redis } from './utils';

import { ArticlesList, LangsList, ProductHasCpuList } from './classes';

const langs = new LangsList();
const articles = new ArticlesList();
const productCpu = new ProductHasCpuList();

(async () => {
  const findLang1 = await langs.lib.get(1);
  const findLang2 = await langs.lib.get(53);

  const findSearchLang3 = await productCpu.getEntitiesByProduct(8892);

  // const findSearchLang1 = await articles.getTranslation(2, 266247);
  // const findSearchLang2 = await articles.getTranslation(
  //   43,
  //   'you_have_been_registered_on_gigabyte_website'
  // );
  // const findSearchLang3 = await langs.lib.search('@alias:by');
  // const findSearchLang4 = await langs.lib.search('@alias:en uk');
  // const findSearchLang5 = await langs.lib.search('@alias:he');

  console.dir(findSearchLang3, { depth: null });

  await redis.quit();
})();
