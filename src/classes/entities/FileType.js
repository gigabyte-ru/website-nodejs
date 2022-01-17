export class FileType {
  constructor(fileTypeDb) {
    this.id = fileTypeDb['id'];
    this.hqKey = fileTypeDb['hq_key'];
    this.dirname = fileTypeDb['dirname'];
    this.name = fileTypeDb['name'];
    this.blockKey = fileTypeDb['block_key'];
  }
}
