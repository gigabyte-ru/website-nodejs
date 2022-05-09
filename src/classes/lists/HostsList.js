import { List } from './List';
import { Host } from '../entities/Host';
import { FieldTypes } from '../../constants';
import prepareForRedisStringSearch from '../../utils/prepareForRedisStringSearch';

export class HostsList extends List {
  static dbName = 'u15821_global';
  static dbTable = 'domains';
  static entityName = Host;

  /**
   * @type { SearchIndexes }
   */
  static searchIndexes = {
    name: {
      type: FieldTypes.STRING,
    },
  };

  /**
   * @param { string } hostName
   * @return { Promise<Host | null> }
   */
  async getByName(hostName) {
    const datas = await this.lib.search(`@name:${prepareForRedisStringSearch(hostName)}`);

    if (datas.length) {
      return new this.constructor.entityName().setDataFromMemory(datas[0]);
    }

    return null;
  }
}
