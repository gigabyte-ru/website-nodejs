/**
 * Handler for page /products/page/:categoryId/:productId/:tab
 * @returns { string }
 */
import { CategoriesList, GlobalVariables } from '../../classes';

export const productPage = async (currentSession) => {
  const category = await new CategoriesList().getByAlias(
    currentSession.route.params['categoryAlias']
  );

  if (!category) {
    return '';
  }

  let page = null;

  try {
    const { ProductPageHandler } = await import(
      `${GlobalVariables.SRC_PATH}/handlers/products/${category.data.originalAlias}/productPageHandler.js`
    );

    currentSession.addCategory(category);

    page = new ProductPageHandler(currentSession);
  } catch (e) {
    console.log(e);
  }

  return page ? await page.parse() : '';
};
