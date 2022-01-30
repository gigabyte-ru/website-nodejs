import { globalVariables } from '../GlobalVariables.js';

export class Product {
  images = [];

  constructor(productDb) {
    this.id = productDb['id'];
    this.alias = productDb['alias'];
    this.originalAlias = productDb['original_alias'];
    this.fullName = productDb['fullname'];
  }

  getImages() {
    this.images = globalVariables.variables.productsImages.get(this.id);
    return this;
  }

  getFiles() {
    this.files = globalVariables.variables.productFiles.get(this.id);
    return this;
  }

  getCpus() {
    this.cpus = globalVariables.variables.productCpus.get(this.id);
    return this;
  }

  log() {
    console.log(this);
    return this;
  }
}
