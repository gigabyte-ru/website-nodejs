import { List } from './List';
import { Os } from '../entities/Os';

export class OsList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'OS';
  static entityName = Os;
}
