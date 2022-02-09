/**
 * @typedef SearchIndexes
 * @type { Record<string, { type: FieldTypes }> }
 */

export class Entity {
  /**
   * @type { SearchIndexes }
   */
  static searchIndexes = {};

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

  setDataFromMemory(data) {
    this.data = data;

    return this;
  }
}
