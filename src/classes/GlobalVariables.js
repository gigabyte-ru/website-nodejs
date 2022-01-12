import { Langs } from './Langs.js';
import { Hosts } from './Hosts.js';
import { Translations } from './Translations.js';
import { Categories } from './Categories.js';
import { Products } from './Products.js';
import { Countries } from './Countries.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * All global variables
 */
class GlobalVariables {
  SRC_PATH = `${process.env.INSTALLED_PATH}src`;

  async init() {
    this.langs = (await new Langs().fill()).update();
    this.hosts = (await new Hosts().fill()).update();
    this.countries = (await new Countries().fill()).update();
    this.translations = (await new Translations(this.langs).fill()).update();
    this.categories = (await new Categories().fill()).update();
    this.products = (await new Products(this.categories).fill()).update();

    return this;
  }
}

export const globalVariables = new GlobalVariables();
