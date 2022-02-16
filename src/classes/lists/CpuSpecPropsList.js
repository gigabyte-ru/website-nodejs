import { List } from './List';
import { CpuSpecProp } from '../entities/CpuSpecProp';
import { FieldTypes } from '../../constants';

export class CpuSpecPropsList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'cpupart_items';
  static entityName = CpuSpecProp;

  /**
   * @type { SearchIndexes }
   */
  static searchIndexes = {
    cpuSpecId: {
      type: FieldTypes.NUMBER,
    },
  };
}
