import { Entity } from './Entity';

/**
 * @typedef LangEntity
 * @type { Object }
 * @property { number } id
 * @property { string } alias
 */

export class Lang extends Entity {
  /**
   * @type { LangEntity }
   */
  data = {};

  /**
   * @return { Lang }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.alias = entityFromDb['alias'];

    return this;
  }
}
