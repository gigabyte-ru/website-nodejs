import { Entity } from './Entity';

/**
 * @typedef TemplateEntity
 * @type { Object }
 * @property { number } id
 * @property { string } alias
 * @property { string } name
 * @property { string } content
 */

export class Template extends Entity {
  /**
   * @type { TemplateEntity }
   */
  data = {};

  /**
   * @return { Template }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.alias = entityFromDb['alias'];
    this.data.name = entityFromDb['name'];
    this.data.content = entityFromDb['content'];

    return this;
  }
}
