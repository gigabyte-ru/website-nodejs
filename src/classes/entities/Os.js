import { Entity } from './Entity';

export class Os extends Entity {
  constructor(osDb) {
    super(osDb);

    this.name = osDb['name'];
    this.alias = osDb['alias'];
    this.originalId = osDb['original_id'];
    this.visibleKey = osDb['visible_key'];
    this.sorder = osDb['sorder'];
  }
}
