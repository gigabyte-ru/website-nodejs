export class Updated {
  updatedAt = new Date();

  update() {
    this.updatedAt = new Date();

    return this;
  }
}
