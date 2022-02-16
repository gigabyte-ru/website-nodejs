import { List } from './List';
import { FileGroup } from '../entities/FileGroup';

export class FileGroupsList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'file_groups';
  static entityName = FileGroup;
}
