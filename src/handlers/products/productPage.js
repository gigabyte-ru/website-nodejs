/**
 * Handler for page /products/page/:categoryId/:productId/:tab
 * @returns {string}
 */
import { globalVariables } from '../../classes/globalVariables.js';

export const productPage = async ({ params, searchParams }) => {
  const category = globalVariables.categories.get(params['categoryAlias']);

  if (!category) {
    return '';
  }

  let product = null;

  try {
    const { ProductPageHandler } = await import(
      `${globalVariables.SRC_PATH}/handlers/products/${category.originalAlias}/productPageHandler.js`
    );

    product = new ProductPageHandler({ params, searchParams, category });
  } catch (e) {
    console.log(e);
  }

  return product ? await product.parse() : '';
};
