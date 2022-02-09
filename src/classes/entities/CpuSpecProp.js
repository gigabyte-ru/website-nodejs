import { Entity } from './Entity';

/**
 * @typedef CpuSpecPropEntity
 * @type { Object }
 * @property { number } id
 * @property { number } cpuSpecId
 * @property { string } value
 * @property { number } sorder
 */

export class CpuSpecProp extends Entity {
  /**
   * @type { CpuSpecPropEntity }
   */
  data = {};

  /**
   * @return { CpuSpecProp }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.cpuSpecId = entityFromDb['cpupart_id'];
    this.data.value = entityFromDb['name'];
    this.data.sorder = entityFromDb['sorder'];

    return this;
  }
}
