import { List } from './List';
import { Article } from '../entities';
import { FieldTypes } from '../../constants';

export class ArticlesList extends List {
  static dbName = 'u15821_global';
  static dbTable = 'articles';
  static entityName = Article;

  /**
   * @type { SearchIndexes }
   */
  static searchIndexes = {
    langId: {
      type: FieldTypes.NUMBER,
    },
    articleId: {
      type: FieldTypes.NUMBER,
    },
    alias: {
      type: FieldTypes.STRING,
    },
  };

  /**
   * @param { number } langId
   * @param { number | string } articleOrAlias
   */
  async getTranslation(langId, articleOrAlias) {
    let searchText = `@langId:[${langId} ${langId}]`;

    if (Number.isInteger(articleOrAlias)) {
      searchText += ` (@articleId:[${articleOrAlias} ${articleOrAlias}] | @alias:${articleOrAlias})`;
    } else {
      searchText += ` @alias:${articleOrAlias}`;
    }

    const data = await this.lib.search(searchText);

    if (data) {
      return new this.constructor.entityName().setDataFromMemory(data);
    }

    return null;
  }
}
