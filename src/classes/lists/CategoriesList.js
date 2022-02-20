import { List } from './List';
import { Category } from '../entities';
import { FieldTypes } from '../../constants';

export class CategoriesList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'categories';
  static entityName = Category;

  /**
   * @type { SearchIndexes }
   */
  static searchIndexes = {
    alias: {
      type: FieldTypes.STRING,
    },
    originalAlias: {
      type: FieldTypes.STRING,
    },
  };

  selectQuery() {
    return `SELECT * FROM \`${this.constructor.dbTable}\` WHERE \`original_id\` > 0`;
  }

  /**
   * @param { string } aliasName
   * @return { Promise<Category | null> }
   */
  async getByAlias(aliasName) {
    const datas = await this.lib.search(
      `@alias:${aliasName} | @originalAlias:${aliasName}`
    );

    if (datas.length) {
      return new this.constructor.entityName().setDataFromMemory(datas[0]);
    }

    return null;
  }
}
