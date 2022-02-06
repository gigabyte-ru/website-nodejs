import { Entity } from './Entity';

export class Country extends Entity {
  /**
   * @typedef CountryEntity
   * @type { Object }
   * @property { number } id
   * @property { number } langId
   * @property { string } name
   * @property { string } link
   * @property { string } redirectLink
   */

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
