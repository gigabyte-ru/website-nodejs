/**
 * Handler for page /products/page/:categoryId/:productId/:tab
 * @returns { string }
 */
import { GlobalVariables } from '../../classes/GlobalVariables';
import { CategoriesList } from '../../classes/lists/CategoriesList';
import { parseTemplateBlocks } from '../../utils';

export const productPage = async (currentSession) => {
  const categoryAlias = currentSession.route.params['categoryAlias'];

  const category = await new CategoriesList().getByAlias(
    currentSession.route.params['categoryAlias']
  );

  if (!category) {
    return '';
  }

  let page = null;

  try {
    const { ProductPageHandler } = await import(
      `${GlobalVariables.SRC_PATH}/handlers/products/${category.data.alias}/productPageHandler.js`
    );

    currentSession.addCategory(category);

    page = new ProductPageHandler(currentSession);
  } catch (e) {
    console.log(e);
  }

  const variables = page ? await page.getVariables() : '';

  return await parseTemplateBlocks('<!--[[INDEX]]-->', variables);
};
