import { DB } from './db.js';
import getValueFromArgv from './getValueFromArgv.js';

const productId = getValueFromArgv('productId', (val) => Number(val) ?? null);
const fromId = getValueFromArgv('fromId', (val) => Number(val) ?? null);

export default async (parserFn = async (product) => {}) => {
  const db = await DB().connect('u15821_products');

  let productsQuery = 'SELECT `id`, `original_id` FROM `products` WHERE `original_id` > 0';

  if (fromId) {
    productsQuery = `${productsQuery} AND \`id\` >= '${fromId}'`;
  }

  if (productId) {
    productsQuery = `${productsQuery} AND \`id\` = '${productId}'`;
  }

  const products = (await db.query(productsQuery)) ?? [];
  
  for (const product of products) {
    await parserFn(product);
  }

  process.exit();
}