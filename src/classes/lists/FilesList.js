import { List } from './List';
import { File } from '../entities/File';

export class FilesList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'files';
  static entityName = File;
}
