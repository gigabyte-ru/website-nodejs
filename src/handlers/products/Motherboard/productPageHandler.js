import {
  parseTemplateBlocks,
  readTemplateFile,
  parseTemplateVariables,
} from '../../../utils';
import { MainMenuHandler } from '../../mainMenuHandler.js';
import { GlobalVariables, ProductsList } from '../../../classes';

export class ProductPageHandler {
  constructor(currentSession) {
    this.currentSession = currentSession;
    const productAlias = currentSession.route.params['productAlias'];
    new ProductsList().getEntityByAlias(productAlias).then((products) => {
      if (products.length) {
        this.product = products.find(
          (p) =>
            p.data.originalAlias === productAlias ||
            p.data.alias === productAlias
        );
        if (this.product) {
          Promise.all([
            this.product.setCpus(),
            this.product.setImages(),
            this.product.setFiles(),
          ]);
        }
      }
    });
    this.mainTemplatePath = `${GlobalVariables.SRC_PATH}/templates/products/${currentSession.category.originalAlias}/index.html`;
  }

  async parseLocalModules() {
    return {
      mainMenu: await new MainMenuHandler().parse(),
    };
  }

  async parse() {
    const mainTemplate = await readTemplateFile(this.mainTemplatePath);

    const templateAfterParseVariables = await parseTemplateVariables(
      mainTemplate,
      {
        connectionType: this.currentSession.connectionType,
        hostName: this.currentSession.host.name,
        productFullName: this.product.fullName,
        productAlias: this.product.alias,
      }
    );

    return await parseTemplateBlocks(
      templateAfterParseVariables,
      await this.parseLocalModules()
    );
  }
}
