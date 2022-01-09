import { readTemplateFile } from '../utils/index.js';

export class MainMenuHandler {
  constructor(currentSession) {
    this.currentSession = currentSession;
  }

  async parse() {
    const templatePath = `${this.currentSession.SRC_PATH}/templates/menu/main.html`;
    return await readTemplateFile(templatePath);
  }
}
