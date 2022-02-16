import { List } from './List';
import { CpuSpec } from '../entities/CpuSpec';

export class CpuSpecsList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'cpuparts';
  static entityName = CpuSpec;
}
