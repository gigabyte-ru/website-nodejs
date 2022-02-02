import { Entity } from './Entity';

export class FileGroup extends Entity {
  constructor(fileGroupDb) {
    super(fileGroupDb);

    this.id = fileGroupDb['id'];
    this.name = fileGroupDb['name'];
    this.alias = fileGroupDb['alias'];
    this.sorder = fileGroupDb['sorder'];
  }
}
