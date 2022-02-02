import { globalVariables } from '../GlobalVariables.js';
import { Entity } from './Entity';

export class Product extends Entity {
  images = [];

  constructor(productDb) {
    super(productDb);

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
