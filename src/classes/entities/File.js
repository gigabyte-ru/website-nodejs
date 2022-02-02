import { Entity } from './Entity';

export class File extends Entity {
  constructor(fileDb) {
    super(fileDb);

    this.groupId = fileDb['group_id'];
    this.filename = fileDb['filename'];
    this.hqUrl = fileDb['hq_url'];
    this.version = fileDb['version'];
    this.filesize = fileDb['filesize'];
    this.description = fileDb['description'];
    this.language = fileDb['language'];
    this.typeId = fileDb['file_type_id'];
  }
}
