import { Entity } from './Entity';

/**
 * @typedef CountryEntity
 * @type { Object }
 * @property { number } id
 * @property { number } langId
 * @property { string } name
 * @property { string } link
 * @property { string } redirectLink
 */

export class Country extends Entity {
  /**
   * @type { CountryEntity }
   */
  data = {};

  /**
   * @return { Country }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.langId = entityFromDb['lang_id'];
    this.data.name = entityFromDb['name'];
    this.data.link = entityFromDb['link'];
    this.data.redirectLink = entityFromDb['link_redirect'];

    return this;
  }
}
