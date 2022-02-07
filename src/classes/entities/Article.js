import { Entity } from './Entity';

export class Article extends Entity {
  /**
   * @typedef ArticleEntity
   * @type { Object }
   * @property { number } id
   * @property { number } langId
   * @property { number } articleId
   * @property { string } alias
   * @property { string } name
   * @property { string } abstract
   * @property { string } description
   * @property { string } code
   * @property { string } link
   */

  /**
   * @type { ArticleEntity }
   */
  data = {};

  /**
   * @return { Article }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.langId = entityFromDb['lang_id'];
    this.data.articleId = entityFromDb['article_id'];
    this.data.alias = entityFromDb['alias'];
    this.data.name = entityFromDb['name'];
    this.data.abstract = entityFromDb['abstract'];
    this.data.description = entityFromDb['description'];
    this.data.code = entityFromDb['code'];
    this.data.link = entityFromDb['link'];

    return this;
  }
}
