import { Entity } from './Entity';

/**
 * @typedef OsEntity
 * @type { Object }
 * @property { number } id
 * @property { string } name
 * @property { string } alias
 * @property { number } originalId
 * @property { boolean } visibleKey
 * @property { number } sorder
 */

export class Os extends Entity {
  /**
   * @type { OsEntity }
   */
  data = {};

  /**
   * @return { Os }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.name = entityFromDb['name'];
    this.data.alias = entityFromDb['alias'];
    this.data.originalId = entityFromDb['original_id'];
    this.data.visibleKey = Boolean(entityFromDb['visible_key']);
    this.data.sorder = entityFromDb['sorder'];

    return this;
  }
}
