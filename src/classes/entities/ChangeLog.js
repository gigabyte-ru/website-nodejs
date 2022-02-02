import { Entity } from './Entity';

export class ChangeLog extends Entity {
  constructor(changeLogDb) {
    super(changeLogDb);

    this.action = changeLogDb['action'];
    this.dbName = changeLogDb['db'];
    this.dbTable = changeLogDb['db_table'];
    this.primaryKey = changeLogDb['primary_key'];
    this.updatedAt = new Date(changeLogDb['updatedAt']);
  }
}
