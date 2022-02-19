import { List } from './List';
import { HtmlBlock } from '../entities/HtmlBlock';

export class HtmlBlocksList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'html_blocks';
  static entityName = HtmlBlock;
}
