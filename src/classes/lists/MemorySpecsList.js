import { List } from './List';
import { MemorySpec } from '../entities/MemorySpec';
import { FieldTypes } from '../../constants';

export class MemorySpecsList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'memory_specs';
  static entityName = MemorySpec;

  /**
   * @type { SearchIndexes }
   */
     static searchIndexes = {
      parentId: {
        type: FieldTypes.NUMBER,
      },
      originalId: {
        type: FieldTypes.NUMBER,
      },
    };
}
