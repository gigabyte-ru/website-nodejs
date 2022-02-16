import { Entity } from './Entity';

/**
 * @typedef CpuEntity
 * @type { Object }
 * @property { number } id
 * @property { string } name
 * @property { number } markId
 * @property { number } socketId
 */

export class Cpu extends Entity {
  /**
   * @type { CpuEntity }
   */
  data = {};

  /**
   * @return { Cpu }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.name = entityFromDb['name'];
    this.data.markId = entityFromDb['markId'];
    this.data.socketId = entityFromDb['socketId'];

    return this;
  }
}
