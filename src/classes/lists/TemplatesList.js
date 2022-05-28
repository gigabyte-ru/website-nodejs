import { List } from './List';
import { FieldTypes } from '../../constants';
import { Template } from '../entities/Template';
import prepareForRedisStringSearch from '../../utils/prepareForRedisStringSearch';

export class TemplatesList extends List {
  static dbName = 'u15821_global';
  static dbTable = 'templates';
  static entityName = Template;

  /**
   * @type { SearchIndexes }
   */
  static searchIndexes = {
    alias: {
      type: FieldTypes.STRING,
    },
  };

  /**
   * @param {string} alias
   * @return {Promise<Template>}
  */
  async getEntityByAlias(alias) {
    const query = this.lib.createQB().where('alias').isEqual(alias);
    const datas = await this.lib.search(query.toString());

    // const datas = await this.lib.search(`@alias:${prepareForRedisStringSearch(alias)}`);

    if (datas.length) {
      return new this.constructor.entityName().setDataFromMemory(datas[0]);
    }

    return null;
  }
}