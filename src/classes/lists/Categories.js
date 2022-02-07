import { Updated } from '../Updated';
import { Category } from '../entities';

export class Categories extends Updated {
  static dbName = 'u15821_products';
  static dbTable = 'categories';
  static entityName = Category;

  selectQuery() {
    return `SELECT * FROM \`${this.constructor.dbTable}\` WHERE \`original_id\` > 0`;
  }
}
