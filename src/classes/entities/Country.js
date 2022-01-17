export class Country {
  constructor(country) {
    this.id = country['id'];
    this.langId = country['lang_id'];
    this.name = country['name'];
    this.link = country['link'];
    this.redirectLink = country['link_redirect'];
  }
}
