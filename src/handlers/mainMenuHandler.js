import { readTemplateFile } from '../utils/index.js';
import { globalVariables } from '../classes/globalVariables.js';

export class MainMenuHandler {
  async parse() {
    const templatePath = `${globalVariables.SRC_PATH}/templates/menu/main.html`;
    return await readTemplateFile(templatePath);
  }
}
