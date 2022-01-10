import { productPage } from '../handlers/products/productPage.js';
import { productCategory } from '../handlers/products/productCategory.js';

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
];
