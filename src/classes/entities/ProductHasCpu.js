import { Entity } from './Entity';
import { CpuHasSpecHasPropList } from '../lists/CpuHasSpecHasPropList';
import { CpuList } from '../lists/CpuList';

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
   * @type { Cpu[] | null }
   */
  cpu = null;

  /**
   * @type { CpuHasSpecHasProp[] | null }
   */
  specsAndProps = null;

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
    this.cpu = await new CpuList().get(this.data.cpuId);

    this.specsAndProps = await new CpuHasSpecHasPropList().getEntitiesByCpu(
      this.data.cpuId
    );

    if (this.specsAndProps) {
      await Promise.all([
        ...this.specsAndProps.map((e) => e.setLinksEntities()),
      ]);
    }
  }
}
