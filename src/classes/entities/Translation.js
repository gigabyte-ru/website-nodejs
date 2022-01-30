export class Translation {
  constructor(articleDb) {
    this.id = articleDb['id'];
    this.langId = articleDb['lang_id'];
    this.articleId = articleDb['article_id'];
    this.alias = articleDb['alias'];
    this.name = articleDb['name'];
    this.abstract = articleDb['abstract'];
    this.description = articleDb['description'];
    this.code = articleDb['code'];
    this.link = articleDb['link'];
  }
}
