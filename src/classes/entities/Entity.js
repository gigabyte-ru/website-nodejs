/**
 * @constructor
 */
export class Entity {
  constructor(entityFromDb) {
    this.id = entityFromDb['id'];
  }
}
