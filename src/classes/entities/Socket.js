import { Entity } from './Entity';
import { CategoriesList } from '../lists/CategoriesList';
import { FieldTypes } from '../../constants';

/**
 * @typedef SocketEntity
 * @type { Object }
 * @property { number } id
 * @property { string } name
 * @property { string } alias
 * @property { number } markId
 * @property { number } categoryId
 * @property { number } countryId
 * @property { boolean } isApproved
 * @property { boolean } isVisible
 * @property { number } sorder
 */

export class Socket extends Entity {
  /**
   * @type { SocketEntity }
   */
  data = {};

  /**
   * @return { Socket }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.name = entityFromDb['name'];
    this.data.alias = entityFromDb['alias'];
    this.data.markId = entityFromDb['mark_id'];
    this.data.categoryId = entityFromDb['category_id'];
    this.data.isApproved = entityFromDb['approved_key'] === 1;
    this.data.isVisible = entityFromDb['visible_key'] === 1;
    this.data.sorder = entityFromDb['sorder'];

    return this;
  }

  async linkEntities() {
    this.category = await new CategoriesList().get(this.categoryId);
    // this.mark =
    return this;
  }
}
