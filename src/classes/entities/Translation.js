import { Entity } from './Entity';

export class Translation extends Entity {
  constructor(articleDb) {
    super(articleDb);

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
