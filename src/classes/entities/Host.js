export class Host {
  constructor(domain) {
    this.firstLangId = domain['lang_id'];
    this.secondLangId = domain['vicarial_lang_id'];
    this.defaultLangId = domain['default_lang_id'];
    this.name = domain['name'];
    this.countryId = domain['country_id'];
  }
}
