export class ProductFile {
  constructor(file, fileGroups, fileTypes, fileOs) {
    this.file = file;
    this.group = fileGroups.get(file.groupId);
    this.type = fileTypes.get(file.typeId);
    this.os = fileOs.get(file.id) ?? null;
  }
}
