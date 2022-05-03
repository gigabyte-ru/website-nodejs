import { Entity } from './Entity';
import { MemoryHasSpecHasPropList } from '../lists/MemoryHasSpecHasPropList';
import { MemoryList } from '../lists/MemoryList';

/**
 * @typedef ProductHasMemoryEntity
 * @type { Object }
 * @property { number } id
 * @property { number } productId
 * @property { number } memoryId
 */

export class ProductHasMemory extends Entity {
  /**
   * @type { ProductHasMemoryEntity }
   */
  data = {};

  /**
   * @type { Memory[] | null }
   */
  memory = null;

  /**
   * @type { MemoryHasSpecHasProp[] | null }
   */
  specsAndProps = null;

  /**
   * @return { ProductHasMemory }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.productId = entityFromDb['product_id'];
    this.data.memoryId = entityFromDb['memory_id'];

    return this;
  }

  async setLinksEntities() {
    this.memory = await new MemoryList().get(this.data.memoryId);

    this.specsAndProps = await new MemoryHasSpecHasPropList().getEntitiesByMemory(
      this.data.memoryId
    );

    if (this.specsAndProps) {
      await Promise.all([
        ...this.specsAndProps.map((e) => e.setLinksEntities()),
      ]);
    }
  }
}
