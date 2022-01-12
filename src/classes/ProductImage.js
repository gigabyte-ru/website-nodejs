export class ProductImage {
  constructor(imageDb) {
    this.id = imageDb['id'];
    this.extension = imageDb['extension'];
    this.path = imageDb['path'];
  }
}
