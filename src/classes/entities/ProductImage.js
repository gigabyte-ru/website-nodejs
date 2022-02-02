import { Entity } from './Entity';

export class ProductImage extends Entity {
  constructor(imageDb) {
    super(imageDb);

    this.productId = imageDb['product_id'];
    this.extension = imageDb['extension'];
    this.path = imageDb['path'];
  }
}
