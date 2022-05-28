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

    const number = Number(articleOrAlias);

    if (Number.isInteger(number)) {
      searchText += ` (@articleId:[${articleOrAlias} ${articleOrAlias}] | (@alias:${articleOrAlias}))`;
    } else {
      searchText += ` @alias:${articleOrAlias}`;
    }

    const data = await this.lib.search(searchText);

    if (data.length) {
      return new this.constructor.entityName().setDataFromMemory(data[0]);
    }

    return null;
  }
}
