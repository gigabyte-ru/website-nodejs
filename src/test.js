import { redis } from './utils';

import { ProductsList } from './classes';

const productsList = new ProductsList();

(async () => {
  /**
   * @type { Product | null }
   */
  const product = (await productsList.getEntityByAlias('H610M H DDR4'))?.[0];
  // await product.setFiles();
  // await product.setCpus();
  // await product.setImages();
  console.dir(product, { depth: null });

  await redis.quit();
})();
