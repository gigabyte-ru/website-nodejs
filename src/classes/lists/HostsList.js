import { List } from './List';
import { Host } from '../entities/Host';
import { FieldTypes } from '../../constants';

export class HostsList extends List {
  static dbName = 'u15821_global';
  static dbTable = 'domains';
  static entityName = Host;

  /**
   * @type { SearchIndexes }
   */
  static searchIndexes = {
    name: {
      type: FieldTypes.NUMBER,
    },
  };
}
