import { Entity } from './Entity';

export class Category extends Entity {
  /**
   * @typedef CategoryEntity
   * @type { Object }
   * @property { number } id
   * @property { number } approved
   * @property { number } parentId
   * @property { string } name
   * @property { string } alias
   * @property { number } originalId
   * @property { number } originalSpecParentId
   * @property { string } originalAlias
   * @property { string } originalName
   * @property { string } originalLinkAlias
   * @property { number } sorder
   */

  /**
   * @type { CategoryEntity }
   */
  data = {};

  /**
   * @return { Category }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.approved = entityFromDb['approved_key'];
    this.data.parentId = entityFromDb['parent_id'];
    this.data.name = entityFromDb['name'];
    this.data.alias = entityFromDb['alias'];
    this.data.originalId = entityFromDb['original_id'];
    this.data.originalSpecParentId = entityFromDb['original_spec_parent_id'];
    this.data.originalAlias = entityFromDb['original_alias'];
    this.data.originalName = entityFromDb['original_name'];
    this.data.originalLinkAlias = entityFromDb['original_link_alias'];
    this.data.sorder = entityFromDb['sorder'];

    return this;
  }
}
