import { redis } from './utils';

import { ArticlesList, GlobalVariables, ProductsList } from './classes';
import { ProductHasMemoryList } from './classes/lists/ProductHasMemoryList';
import { HostsList } from './classes/lists/HostsList';

const productsList = new ProductsList();
const productHasMemoryList = new ProductHasMemoryList();
const globalVariables = new GlobalVariables();
const articles = new ArticlesList();
const hostList = new HostsList();

(async () => {
  const host = await hostList.getByName('gigabyte.ru');
  console.dir(host, { depth: null });

  // const product = await productsList.get(8763);
  // await product.setMemories();
  // await product.setMemorySummary();

  // // await product.setFiles();
  // // await product.setCpus();
  // // await product.setImages();
  //console.dir(product, { depth: null });

  // const updatedAt = await globalVariables.getUpdatedAt();
  //
  // console.log('updatedAt', updatedAt);

  // const article1 = await articles.get(267465);
  // const article2 = await articles.get(267464);

  // console.log({ article1, article2 });

  await redis.quit();
})();
