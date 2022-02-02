import { readTemplateFile } from '../utils';
import { GlobalVariablesParser } from '../classes';

export class MainMenuHandler {
  async parse() {
    const templatePath = `${GlobalVariablesParser.SRC_PATH}/templates/menu/main.html`;
    return await readTemplateFile(templatePath);
  }
}
