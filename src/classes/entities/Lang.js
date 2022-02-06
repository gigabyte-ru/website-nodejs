import { Entity } from './Entity';

export class Lang extends Entity {
  /**
   * @typedef LangEntity
   * @type { Object }
   * @property { number } id
   * @property { string } alias
   */

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
