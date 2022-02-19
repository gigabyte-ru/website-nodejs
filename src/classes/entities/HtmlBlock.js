import { Entity } from './Entity';

/**
 * @typedef HtmlBlockEntity
 * @type { Object }
 * @property { number } id
 * @property { string } name
 * @property { string } description
 * @property { string } tags
 * @property { string } sources
 */

export class HtmlBlock extends Entity {
  /**
   * @type { HtmlBlockEntity }
   */
  data = {};

  /**
   * @return { HtmlBlock }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.name = entityFromDb['name'];
    this.data.description = entityFromDb['description'];
    this.data.tags = entityFromDb['tags'];
    this.data.sources = entityFromDb['sources'];

    return this;
  }
}
