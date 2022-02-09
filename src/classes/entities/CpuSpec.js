import { Entity } from './Entity';

export class CpuSpec extends Entity {
  /**
   * @typedef CpuSpecEntity
   * @type { Object }
   * @property { number } id
   * @property { string } name
   * @property { string } unit
   * @property { number } sorder
   */

  /**
   * @type { CpuSpecEntity }
   */
  data = {};

  /**
   * @return { CpuSpec }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.name = entityFromDb['name'];
    this.data.unit = entityFromDb['unit'];
    this.data.sorder = entityFromDb['sorder'];

    return this;
  }
}
