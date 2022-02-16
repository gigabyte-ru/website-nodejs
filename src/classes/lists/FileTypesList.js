import { List } from './List';
import { FileType } from '../entities/FileType';

export class FileTypesList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'file_types';
  static entityName = FileType;
}
