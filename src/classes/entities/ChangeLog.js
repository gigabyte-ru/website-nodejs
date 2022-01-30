export class ChangeLog {
  constructor(changeLogDb) {
    this.id = changeLogDb['id'];
    this.action = changeLogDb['action'];
    this.dbName = changeLogDb['db'];
    this.dbTable = changeLogDb['db_table'];
    this.primaryKey = changeLogDb['primary_key'];
  }
}
