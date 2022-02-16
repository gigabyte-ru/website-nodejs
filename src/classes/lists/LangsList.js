import { List } from './List';
import { Lang } from '../entities/Lang';
import { FieldTypes } from '../../constants';

export class LangsList extends List {
  static dbName = 'u15821_global';
  static dbTable = 'langs';
  static entityName = Lang;

  /**
   * @type { SearchIndexes }
   */
  static searchIndexes = {
    alias: {
      type: FieldTypes.STRING,
    },
  };
}
