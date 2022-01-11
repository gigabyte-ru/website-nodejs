import {
  parseTemplateBlocks,
  readTemplateFile,
  parseTemplateVariables,
} from '../../../utils/index.js';
import { MainMenuHandler } from '../../mainMenuHandler.js';
import { globalVariables } from '../../../classes/globalVariables.js';

export class ProductPageHandler {
  constructor(currentSession) {
    this.currentSession = currentSession;
    this.product = globalVariables.products.get(
      currentSession.category,
      currentSession.route.params['productAlias']
    );
    this.mainTemplatePath = `${globalVariables.SRC_PATH}/templates/products/${currentSession.category.originalAlias}/index.html`;
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

    const templateAfterParseBlocks = await parseTemplateBlocks(
      templateAfterParseVariables,
      await this.parseLocalModules()
    );

    return templateAfterParseBlocks;
  }
}
