import { Updated } from '../Updated';
import { SchemaFieldTypes } from 'redis';
import { FieldTypes } from '../../constants';
import { Host } from '../entities';

export class Hosts extends Updated {
  static dbName = 'u15821_global';
  static dbTable = 'domains';
  static entityName = Host;
  /**
   * @type { Object.<string, SearchIndex>  }
   */
  static searchIndexes = {
    name: {
      type: FieldTypes.NUMBER,
    },
  };
}
