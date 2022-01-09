import { productPage } from '../handlers/productPage.js';
import { productCategory } from '../handlers/productCategory.js';

/**
 * Handlers for paths
 * @type {[{path: string, handler: ((function({currentSession: *, query: *}): string)|*)},{path: string, handler: ((function({currentSession: *, query: *}): string)|*)},{path: string, handler: ((function({currentSession: *, query: *}): string)|*)}]}
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
