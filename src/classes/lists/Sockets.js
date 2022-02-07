import { Updated } from '../Updated';
import { FieldTypes } from '../../constants';
import { Socket } from '../entities';

export class Sockets extends Updated {
  static dbName = 'u15821_products';
  static dbTable = 'sockets';
  static entityName = Socket;
  /**
   * @type { Object.<string, SearchIndex>  }
   */
  static searchIndexes = {
    name: {
      type: FieldTypes.STRING,
    },
    alias: {
      type: FieldTypes.STRING,
    },
  };
}
