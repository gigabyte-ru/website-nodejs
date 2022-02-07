import { Updated } from '../Updated';
import { Lang } from '../entities';
import { FieldTypes } from '../../constants';

export class Langs extends Updated {
  static dbName = 'u15821_global';
  static dbTable = 'langs';
  static entityName = Lang;
  /**
   * @type { Object.<string, SearchIndex>  }
   */
  static searchIndexes = {
    alias: {
      type: FieldTypes.STRING,
    },
  };
}
