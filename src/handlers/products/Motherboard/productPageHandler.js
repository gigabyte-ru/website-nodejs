import {
  parseTemplateBlocks,
  readTemplateFile,
  parseTemplateVariables,
} from '../../../utils/index.js';
import { MainMenuHandler } from '../../mainMenuHandler.js';
import { globalVariables } from '../../../classes/globalVariables.js';
import { currentSession } from '../../../classes/currentSession.js';

export class ProductPageHandler {
  constructor({ params, searchParams, category }) {
    this.category = category;
    this.params = params;
    this.searchParams = searchParams;
    this.product = globalVariables.products.get(
      category,
      params['productAlias']
    );
    this.mainTemplatePath = `${globalVariables.SRC_PATH}/templates/products/${category.originalAlias}/index.html`;
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
        connectionType: currentSession.connectionType,
        hostName: currentSession.host.name,
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
