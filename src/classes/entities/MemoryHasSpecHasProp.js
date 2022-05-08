import { Entity } from './Entity';
import { MemorySpecsList } from '../lists/MemorySpecsList';
import { MemorySpecPropsList } from '../lists/MemorySpecPropsList';

/**
 * @typedef MemoryHasSpecHasPropEntity
 * @type { Object }
 * @property { number } id
 * @property { number } memoryId
 * @property { number } memorySpecId
 * @property { number } memorySpecPropId
 */

export class MemoryHasSpecHasProp extends Entity {
  /**
   * @type { MemoryHasSpecHasPropEntity }
   */
  data = {};

  /**
   * @type { MemorySpec | null }
   */
  memorySpec = null;

  /**
   * @type { MemorySpecProp | null }
   */
  memorySpecProp = null;

  /**
   * @return { MemoryHasSpecHasProp }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.memoryId = entityFromDb['memory_id'];
    this.data.memorySpecId = entityFromDb['memory_spec_id'];
    this.data.memorySpecPropId = entityFromDb['memory_spec_prop_id'];

    return this;
  }

  async setLinksEntities() {
    this.memorySpec = await new MemorySpecsList().get(this.data.memorySpecId);
    await this.memorySpec.setParent();

    this.memorySpecProp = await new MemorySpecPropsList().get(
      this.data.memorySpecPropId
    );
  }
}
