import { List } from './List';
import { CpuHasSpecHasProp } from '../entities/CpuHasSpecHasProp';
import { FieldTypes } from '../../constants';

export class CpuHasSpecHasPropList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'cpu_cpupart_items';
  static entityName = CpuHasSpecHasProp;

  /**
   * @type { SearchIndexes }
   */
  static searchIndexes = {
    cpuId: {
      type: FieldTypes.NUMBER,
    },
    cpuSpecId: {
      type: FieldTypes.NUMBER,
    },
    cpuSpecPropId: {
      type: FieldTypes.NUMBER,
    },
  };

  /**
   * @param {number } cpuId
   * @return {Promise<CpuHasSpecHasProp[]>}
   */
  async getEntitiesByCpu(cpuId) {
    return (await this.lib.search(`@cpuId:[${cpuId} ${cpuId}]`)).map((e) =>
      new CpuHasSpecHasProp().setDataFromMemory(e)
    );
  }
}
