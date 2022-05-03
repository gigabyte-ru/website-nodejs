import { List } from './List';
import { FieldTypes } from '../../constants';
import { MemoryHasSpecHasProp } from '../entities/MemoryHasSpecHasProp';

export class MemoryHasSpecHasPropList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'memoryHasSpecsHasProps';
  static entityName = MemoryHasSpecHasProp;

  /**
   * @type { SearchIndexes }
   */
  static searchIndexes = {
    memoryId: {
      type: FieldTypes.NUMBER,
    },
    memorySpecId: {
      type: FieldTypes.NUMBER,
    },
    memorySpecPropId: {
      type: FieldTypes.NUMBER,
    },
  };

  /**
   * @param { number } memoryId
   * @return {Promise<MemoryHasSpecHasProp[]>}
   */
  async getEntitiesByMemory(memoryId) {
    return (await this.lib.search(`@memoryId:[${memoryId} ${memoryId}]`)).map((e) =>
      new MemoryHasSpecHasProp().setDataFromMemory(e)
    );
  }
}
