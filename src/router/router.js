import { productPage } from '../handlers/products/productPage';
import { productCategory } from '../handlers/products/productCategory';
import { productMemoriesTable } from '../handlers/products/productMemoriesTable'

/**
 * Handlers for paths
 */
export const router = [
  {
    path: '/products/:categoryAlias',
    handler: productCategory,
  },
  {
    path: '/products/page/:categoryAlias/:productAlias',
    handler: productPage,
  },
  {
    path: '/products/page/:categoryAlias/:productAlias/:tab',
    handler: productPage,
  },
  {
    path: '/api/getProductMemories/:productId',
    handler: productMemoriesTable,
  }
];
