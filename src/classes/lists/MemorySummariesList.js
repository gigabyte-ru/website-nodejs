import { List } from './List';
import { MemorySummary } from '../entities/MemorySummary';

export class MemorySummariesList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'memory_summaries';
  static entityName = MemorySummary;
}
