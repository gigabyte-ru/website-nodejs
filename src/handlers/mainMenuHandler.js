import { readTemplateFile } from '../utils';
import { GlobalVariables } from '../classes';

export class MainMenuHandler {
  async parse() {
    const templatePath = `${GlobalVariables.SRC_PATH}/templates/menu/main.html`;
    return await readTemplateFile(templatePath);
  }
}
