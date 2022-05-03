import { List } from './List';
import { FieldTypes } from '../../constants';
import { MemorySpecProp } from '../entities/MemorySpecProp';

export class MemorySpecPropsList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'memory_spec_props';
  static entityName = MemorySpecProp;

  /**
   * @type { SearchIndexes }
   */
  static searchIndexes = {
    memorySpecId: {
      type: FieldTypes.NUMBER,
    },
  };
}
