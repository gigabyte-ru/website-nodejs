import { Entity } from './Entity';

/**
 * @typedef HostEntity
 * @type { Object }
 * @property { number } id
 * @property { number } firstLangId
 * @property { number } secondLangId
 * @property { number } defaultLangId
 * @property { string } name
 * @property { number } countryId
 */

export class Host extends Entity {
  /**
   * @type { HostEntity }
   */
  data = {};

  /**
   * @return { Host }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.firstLangId = entityFromDb['lang_id'];
    this.data.secondLangId = entityFromDb['vicarial_lang_id'];
    this.data.defaultLangId = entityFromDb['default_lang_id'];
    this.data.name = entityFromDb['name'];
    this.data.countryId = entityFromDb['country_id'];

    return this;
  }
}
