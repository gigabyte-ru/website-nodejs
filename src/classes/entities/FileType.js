import { Entity } from './Entity';

export class FileType extends Entity {
  constructor(fileTypeDb) {
    super(fileTypeDb);

    this.hqKey = fileTypeDb['hq_key'];
    this.dirname = fileTypeDb['dirname'];
    this.name = fileTypeDb['name'];
    this.blockKey = fileTypeDb['block_key'];
  }
}
