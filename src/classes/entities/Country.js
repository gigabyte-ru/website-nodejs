import { Entity } from './Entity';

export class Country extends Entity {
  constructor(country) {
    super(country);

    this.langId = country['lang_id'];
    this.name = country['name'];
    this.link = country['link'];
    this.redirectLink = country['link_redirect'];
  }
}
