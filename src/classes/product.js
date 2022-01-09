export class Product {
  constructor(productDb) {
    this.id = productDb.id;
    this.alias = productDb['alias'];
    this.originalAlias = productDb['original_alias'];
    this.fullName = productDb['fullname'];
  }
}
