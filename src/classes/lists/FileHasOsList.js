import { List } from './List';
import { FileHasOs } from '../entities/FileHasOs';
import { FieldTypes } from '../../constants';

export class FileHasOsList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'OS_files';
  static entityName = FileHasOs;

  /**
   * @type { SearchIndexes }
   */
  static searchIndexes = {
    fileId: {
      type: FieldTypes.NUMBER,
    },
  };

  /**
   * @param { number } fileId
   * @return { Promise<FileHasOs[]> }
   */
  async getEntitiesByFile(fileId) {
    return (await this.lib.search(`@fileId:[${fileId} ${fileId}]`)).map((e) =>
      new FileHasOs().setDataFromMemory(e)
    );
  }
}
