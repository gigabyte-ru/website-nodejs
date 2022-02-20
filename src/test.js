import { redis } from './utils';

import { ArticlesList, GlobalVariables, ProductsList } from './classes';

const productsList = new ProductsList();
const globalVariables = new GlobalVariables();
const articles = new ArticlesList();

(async () => {
  // /**
  //  * @type { Product | null }
  //  */
  // const product = (await productsList.getEntityByAlias('H610M H DDR4'))?.[0];
  // // await product.setFiles();
  // // await product.setCpus();
  // // await product.setImages();
  // console.dir(product, { depth: null });

  // const updatedAt = await globalVariables.getUpdatedAt();
  //
  // console.log('updatedAt', updatedAt);

  const article1 = await articles.get(267465);
  const article2 = await articles.get(267464);

  console.log({ article1, article2 });

  await redis.quit();
})();
