import { Entity } from './Entity';

/**
 * @typedef FileParam
 * @type Object
 * @property { File } file
 * @property { Map<number, FileGroup> } fileGroups
 * @property { Map<number, FileType> } fileTypes
 * @property { Map<number, OsFile> } osFiles
 */
export class ProductFile extends Entity {
  /**
   * @param { Object } p
   * @param { FileParam } fileParam
   */
  constructor(p, { file, fileGroups, fileTypes, osFiles }) {
    super(p);

    this.file = file;
    this.group = fileGroups.get(file.groupId);
    this.type = fileTypes.get(file.typeId);
    this.os = osFiles.get(file.id) ?? null;
  }
}
