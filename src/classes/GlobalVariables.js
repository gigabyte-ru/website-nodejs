import { Langs } from './Langs.js';
import { Hosts } from './Hosts.js';
import { Translations } from './Translations.js';
import { Categories } from './Categories.js';
import { Products } from './Products.js';
import { Countries } from './Countries.js';
import { ProductImages } from './ProductImages.js';
import dotenv from 'dotenv';
import { ProductFiles } from './ProductFiles.js';
import { Sockets } from './Sockets.js';
import { ProductCpus } from './ProductCpus.js';
dotenv.config();

class GlobalVariables {
  SRC_PATH = `${process.env.INSTALLED_PATH}src`;

  async init() {
    this.langs = (await new Langs().fill()).update().log();
    this.hosts = (await new Hosts().fill()).update().log();
    this.countries = (await new Countries().fill()).update().log();
    this.translations = (await new Translations(this.langs).fill())
      .update()
      .log();
    this.categories = (await new Categories().fill()).update().log();
    this.sockets = (await new Sockets().fill()).update().log();
    this.products = (await new Products(this.categories).fill()).update().log();
    this.productsImages = (await new ProductImages().fill()).update().log();
    this.productFiles = (await new ProductFiles().fill()).update().log();
    this.productCpus = (await new ProductCpus().fill()).update().log();

    return this;
  }
}

/**
 * All global variables
 */
export const globalVariables = new GlobalVariables();
