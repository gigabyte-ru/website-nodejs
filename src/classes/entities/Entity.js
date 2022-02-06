/**
 * @constructor
 */
export class Entity {
  data = {};

  /**
   * @abstract
   * @param entityFromDb
   * @return {Entity}
   */
  setDataFromDb(entityFromDb) {
    this.data.id = entityFromDb.id;

    return this;
  }

  setData(data) {
    this.data = data;

    return this;
  }
}
