import { Entity } from './Entity';
import { CpuList } from '../lists/CpuList';
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
   * @type { CpuEntity | null }
   */
  cpu = null;

  /**
   * @type { CpuSpecEntity | null }
   */
  cpuSpec = null;

  /**
   * @type { CpuSpecPropEntity | null }
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
    this.cpu = await new CpuList().get(this.data.cpuId);
    this.cpuSpec = await new CpuSpecsList().get(this.data.cpuSpecId);
    this.cpuSpecProp = await new CpuSpecPropsList().get(
      this.data.cpuSpecPropId
    );
  }
}
