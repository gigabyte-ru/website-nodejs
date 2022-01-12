export class Os {
  constructor(osDb) {
    this.id = osDb['id'];
    this.name = osDb['name'];
    this.alias = osDb['alias'];
    this.originalId = osDb['original_id'];
    this.visibleKey = osDb['visible_key'];
    this.sorder = osDb['sorder'];
  }
}
