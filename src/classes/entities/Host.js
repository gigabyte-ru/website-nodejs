import { Entity } from './Entity';

export class Host extends Entity {
  constructor(domain) {
    super(domain);

    this.firstLangId = domain['lang_id'];
    this.secondLangId = domain['vicarial_lang_id'];
    this.defaultLangId = domain['default_lang_id'];
    this.name = domain['name'];
    this.countryId = domain['country_id'];
  }
}
