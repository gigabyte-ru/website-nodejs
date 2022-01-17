import { globalVariables } from '../GlobalVariables.js';

export class Socket {
  constructor(socketDb) {
    this.id = socketDb['id'];
    this.isApproved = socketDb['approved_key'];
    this.name = socketDb['name'];
    this.alias = socketDb['alias'];
    this.markId = socketDb['mark_id'];
    this.categoryId = socketDb['category_id'];
    this.isVisible = socketDb['visible_key'];
    this.sorder = socketDb['sorder'];
  }

  getCategory() {
    this.category = globalVariables.categories.get(this.categoryId);
    return this;
  }
}
