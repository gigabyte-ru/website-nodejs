import { Entity } from './Entity';

/**
 * @typedef MemorySummaryEntity
 * @type { Object }
 * @property { number } id
 * @property { string } name
 */

export class MemorySummary extends Entity {
  /**
   * @type { MemorySummaryEntity }
   */
  data = {};

  /**
   * @return { MemorySummary }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.name = entityFromDb['name'];

    return this;
  }
}
