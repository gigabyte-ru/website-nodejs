import { productPage } from '../handlers/products/productPage';
import { productCategory } from '../handlers/products/productCategory';
import { productMemoriesTable } from '../handlers/products/productMemoriesList'
import productMemoriesHtml from '../handlers/products/productMemoriesHtml'

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
    path: '/test/getProductMemories',
    handler: productMemoriesHtml,
  },
  {
    path: '/api/getProductMemories/:productId',
    handler: productMemoriesTable,
  }
];
