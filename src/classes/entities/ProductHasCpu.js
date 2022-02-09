import { Entity } from './Entity';
import { CpuHasSpecHasPropList } from '../lists/CpuHasSpecHasPropList';

/**
 * @typedef ProductHasCpuEntity
 * @type { Object }
 * @property { number } id
 * @property { number } productId
 * @property { number } cpuId
 * @property { string } bios
 * @property { number } sorder
 */

export class ProductHasCpu extends Entity {
  /**
   * @type { ProductHasCpuEntity }
   */
  data = {};

  /**
   * @type { CpuHasSpecHasProp[] | null }
   */
  cpuHasSpecHasPropEntities = null;

  /**
   * @return { ProductHasCpu }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.productId = entityFromDb['product_id'];
    this.data.cpuId = entityFromDb['cpu_id'];
    this.data.bios = entityFromDb['bios'];
    this.data.sorder = entityFromDb['sorder'];

    return this;
  }

  async setLinksEntities() {
    this.cpuHasSpecHasPropEntities =
      await new CpuHasSpecHasPropList().getEntitiesByCpu(this.data.cpuId);

    if (this.cpuHasSpecHasPropEntities) {
      await Promise.all([
        ...this.cpuHasSpecHasPropEntities.map((e) => e.setLinksEntities()),
      ]);
    }
  }
}
