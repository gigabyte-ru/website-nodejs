import { Entity } from './Entity';

export class Lang extends Entity {
  constructor(lang) {
    super(lang);

    this.alias = lang['alias'];
  }
}
