import { globalVariables } from '../GlobalVariables.js';
import { Entity } from './Entity';

export class Socket extends Entity {
  constructor(socketDb) {
    super(socketDb);

    this.isApproved = socketDb['approved_key'];
    this.name = socketDb['name'];
    this.alias = socketDb['alias'];
    this.markId = socketDb['mark_id'];
    this.categoryId = socketDb['category_id'];
    this.isVisible = socketDb['visible_key'];
    this.sorder = socketDb['sorder'];
  }

  getCategory() {
    this.category = globalVariables.variables.categories.get(this.categoryId);
    return this;
  }
}
