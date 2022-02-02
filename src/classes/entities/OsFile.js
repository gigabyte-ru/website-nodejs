import { Entity } from './Entity';

export class OsFile extends Entity {
  constructor(db, os) {
    super(db);

    this.os = [os];
  }

  addOs(os) {
    this.os.push(os);
  }
}
