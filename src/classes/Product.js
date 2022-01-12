import { globalVariables } from './GlobalVariables.js';

export class Product {
  images = [];

  constructor(productDb) {
    this.id = productDb.id;
    this.alias = productDb['alias'];
    this.originalAlias = productDb['original_alias'];
    this.fullName = productDb['fullname'];
    this.images = globalVariables.productImages.get(this.id);
  }
}
