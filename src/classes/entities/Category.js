import { Entity } from './Entity';

export class Category extends Entity {
  constructor(category) {
    super(category);

    this.approved = category['approved_key'];
    this.parentId = category['parent_id'];
    this.name = category['name'];
    this.alias = category['alias'];
    this.originalId = category['original_id'];
    this.originalSpecParentId = category['original_spec_parent_id'];
    this.originalAlias = category['original_alias'];
    this.originalName = category['original_name'];
    this.originalLinkAlias = category['original_link_alias'];
    this.order = category['sorder'];
  }
}
