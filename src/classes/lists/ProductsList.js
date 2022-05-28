import { List } from './List';
import { Product } from '../entities/Product';
import { FieldTypes } from '../../constants';
import prepareForRedisStringSearch from '../../utils/prepareForRedisStringSearch';

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
    const redisAlias = prepareForRedisStringSearch(alias);

    return (
      await this.lib.search(`(@originalAlias:${redisAlias}) | (@alias:${redisAlias})`)
    ).map((e) => new Product().setDataFromMemory(e));
  }

  /**
   * @param { string } alias
   * @return {Promise<Product[]>}
   */
  async getEntityByName(name) {
    const redisAlias = prepareForRedisStringSearch(name);

    return (await this.lib.search(`@fullName:${redisAlias}`)).map((e) =>
      new Product().setDataFromMemory(e)
    );
  }
}
