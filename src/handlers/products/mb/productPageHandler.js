import { ProductsList } from '../../../classes/lists/ProductsList';

export class ProductPageHandler {
  constructor(currentSession) {
    this.currentSession = currentSession;
  }

  async getVariables() {
    const productAlias = this.currentSession.route.params['productAlias'];
    const currentTab = this.currentSession.route.params['tab'] ?? 'sp';

    const product = (await new ProductsList().getEntityByAlias(productAlias))?.[0]

    if (product) {
      await Promise.all([
        product.setCpus(),
        product.setImages(),
        product.setFiles(),
      ]);
    }

    return {}
  }
}
