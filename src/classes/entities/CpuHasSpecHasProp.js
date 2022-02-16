import { Entity } from './Entity';
import { CpuSpecsList } from '../lists/CpuSpecsList';
import { CpuSpecPropsList } from '../lists/CpuSpecPropsList';

/**
 * @typedef CpuHasSpecHasPropEntity
 * @type { Object }
 * @property { number } id
 * @property { number } cpuId
 * @property { number } cpuSpecId
 * @property { number } cpuSpecPropId
 */

export class CpuHasSpecHasProp extends Entity {
  /**
   * @type { CpuHasSpecHasPropEntity }
   */
  data = {};

  /**
   * @type { CpuSpec | null }
   */
  cpuSpec = null;

  /**
   * @type { CpuSpecProp | null }
   */
  cpuSpecProp = null;

  /**
   * @return { CpuHasSpecHasProp }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.cpuId = entityFromDb['cpu_id'];
    this.data.cpuSpecId = entityFromDb['cpupart_id'];
    this.data.cpuSpecPropId = entityFromDb['cpupart_item_id'];

    return this;
  }

  async setLinksEntities() {
    this.cpuSpec = await new CpuSpecsList().get(this.data.cpuSpecId);
    this.cpuSpecProp = await new CpuSpecPropsList().get(
      this.data.cpuSpecPropId
    );
  }
}
