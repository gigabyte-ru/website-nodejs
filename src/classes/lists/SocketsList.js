import { List } from './List';
import { FieldTypes } from '../../constants';
import { Socket } from '../entities';

export class SocketsList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'sockets';
  static entityName = Socket;

  /**
   * @type { SearchIndexes }
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
