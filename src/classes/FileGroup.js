export class FileGroup {
  constructor(fileGroupDb) {
    this.id = fileGroupDb['id'];
    this.name = fileGroupDb['name'];
    this.alias = fileGroupDb['alias'];
    this.sorder = fileGroupDb['sorder'];
  }
}
