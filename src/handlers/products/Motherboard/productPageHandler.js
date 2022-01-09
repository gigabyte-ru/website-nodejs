import {
  parseTemplateBlocks,
  readTemplateFile,
  parseTemplateVariables,
} from '../../../utils/index.js';
import { MainMenuHandler } from '../../mainMenuHandler.js';

export class ProductPageHandler {
  constructor(options, category) {
    const { currentSession, params, searchParams } = options;

    this.category = category;
    this.currentSession = currentSession;
    this.params = params;
    this.searchParams = searchParams;
    this.product = currentSession.globalVariables.products.get(
      category,
      params['productAlias']
    );
  }

  async parseLocalModules() {
    return {
      mainMenu: await new MainMenuHandler(this.currentSession).parse(),
    };
  }

  async parse() {
    const templateVariables = await parseTemplateVariables(
      await this.getMainTemplate(),
      {
        productFullName: this.product.fullName,
      }
    );

    const parseBlocksString = await parseTemplateBlocks(
      templateVariables,
      await this.parseLocalModules()
    );
    return parseBlocksString;
  }

  async getMainTemplate() {
    const templatePath = `${this.currentSession.SRC_PATH}/templates/products/${this.category.originalAlias}/index.html`;
    return await readTemplateFile(templatePath);
  }
}
