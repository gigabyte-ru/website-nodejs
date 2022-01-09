/**
 * Handler for page /products/page/:categoryId/:productId/:tab
 * @param currentSession
 * @param params
 * @param query
 * @returns {string}
 */
export const productPage = async (options) => {
  const { currentSession, params } = options;

  const category = currentSession.globalVariables.categories.get(
    params['categoryAlias']
  );

  if (!category) {
    return '';
  }

  let product = null;

  try {
    const { ProductPageHandler } = await import(
      `${currentSession.SRC_PATH}/handlers/products/${category.originalAlias}/productPageHandler.js`
    );

    product = new ProductPageHandler(options, category);
  } catch (e) {
    console.log(e);
  }

  return product ? await product.parse() : '';
};
