import { List } from './List';
import { Cpu } from '../entities';

export class CpuList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'cpu';
  static entityName = Cpu;
}
