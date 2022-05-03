import { List } from './List';
import { Memory } from '../entities/Memory';

export class MemoryList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'memories';
  static entityName = Memory;
}
