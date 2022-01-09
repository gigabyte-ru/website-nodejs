import { Langs } from './langs.js';
import { Hosts } from './hosts.js';
import { Translations } from './translations.js';
import { Categories } from './categories.js';
import { Products } from './products.js';
import { Countries } from './countries.js';

/**
 * All global variables
 */
export class GlobalVariables {
  async init() {
    this.langs = (await new Langs().fill()).update();
    this.hosts = (await new Hosts().fill()).update();
    this.countries = (await new Countries().fill()).update();
    // this.translations = (await new Translations(this.langs).fill()).update();
    this.categories = (await new Categories().fill()).update();
    this.products = (await new Products(this.categories).fill()).update();

    return this;
  }
}
