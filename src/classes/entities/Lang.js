import { Entity } from './Entity';
import { FieldTypes } from '../../constants';

/**
 * @typedef LangEntity
 * @type { Object }
 * @property { number } id
 * @property { string } alias
 */

export class Lang extends Entity {
  /**
   * @type { Object.<string, SearchIndex>  }
   */
  static searchIndexes = {
    alias: {
      type: FieldTypes.STRING,
    },
  };

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
