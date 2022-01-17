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
    this.images = globalVariables.productsImages.get(this.id);
    return this;
  }

  getFiles() {
    this.files = globalVariables.productFiles.get(this.id);
    return this;
  }

  getCpus() {
    this.cpus = globalVariables.productCpus.get(this.id);
    return this;
  }

  log() {
    console.log(this);
    return this;
  }
}
