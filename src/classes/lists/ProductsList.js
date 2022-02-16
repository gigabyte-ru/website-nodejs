import { List } from './List';
import { Product } from '../entities/Product';
import { FieldTypes } from '../../constants';

export class ProductsList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'products';
  static entityName = Product;

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
    fullName: {
      type: FieldTypes.STRING,
    },
  };

  selectQuery() {
    return `SELECT * FROM \`${ProductsList.dbTable}\` WHERE \`original_alias\` IS NOT NULL`;
  }

  /**
   * @param { string } alias
   * @return {Promise<Product[]>}
   */
  async getEntityByAlias(alias) {
    return (
      await this.lib.search(`@originalAlias:${alias} | @alias:${alias}`)
    ).map((e) => new Product().setDataFromMemory(e));
  }

  /**
   * @param { string } alias
   * @return {Promise<Product[]>}
   */
  async getEntityByName(name) {
    return (await this.lib.search(`@fullName:${name}`)).map((e) =>
      new Product().setDataFromMemory(e)
    );
  }
}
