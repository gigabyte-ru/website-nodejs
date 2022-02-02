/**
 * Handler for page /products/page/:categoryId/:productId/:tab
 * @returns {string}
 */
import { GlobalVariablesParser, globalVariables } from '../../classes';

export const productPage = async (currentSession) => {
  const category = globalVariables.variables.categories.get(
    currentSession.route.params['categoryAlias']
  );

  if (!category) {
    return '';
  }

  let page = null;

  try {
    const { ProductPageHandler } = await import(
      `${GlobalVariablesParser.SRC_PATH}/handlers/products/${category.originalAlias}/productPageHandler.js`
    );

    currentSession.addCategory(category);

    page = new ProductPageHandler(currentSession);
  } catch (e) {
    console.log(e);
  }

  return page ? await page.parse() : '';
};
