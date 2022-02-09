import { Entity } from './Entity';

export class ChangeLog extends Entity {
  /**
   * @typedef ChangeLogEntity
   * @type { Object }
   * @property { number } id
   * @property { 'insert' | 'update' | 'delete' } action
   * @property { string } dbName
   * @property { string } dbTable
   * @property { number } primaryKey
   * @property { string } updatedAt
   */

  /**
   * @type { ChangeLogEntity }
   */
  data = {};

  /**
   * @return { ChangeLog }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.action = entityFromDb['action'];
    this.dbName = entityFromDb['db'];
    this.dbTable = entityFromDb['db_table'];
    this.primaryKey = entityFromDb['primary_key'];
    this.updatedAt = entityFromDb['updatedAt'];
  }
}
