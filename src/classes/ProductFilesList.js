import { ProductImage } from './ProductImage.js';
import { DB } from '../utils/index.js';
import { Products } from './Products.js';

export class ProductFilesList {
  children = [];

  constructor(parent) {
    this.parent = parent;
  }

  async init(db) {
    this.children = await this.getDataFromDb(db).map(
      (i) => new ProductImage(i)
    );
  }

  async getDataFromDb(db = null) {
    const currentDb = db ?? (await DB().connect(Products.dbName));

    const query =
      'SELECT `files`.*, `file_groups`.*, `file_types`.*, `OS`.* FROM `product_files` ' +
      'LEFT JOIN `files` ON `product_files`.`file_id` = `files`.`id` ' +
      'LEFT JOIN `file_groups` ON `files`.`group_id` = `file_groups`.`id` ' +
      'LEFT JOIN `file_types` ON `files`.`file_type_id` = `file_types`.`id` ' +
      'LEFT JOIN `OS_files` ON `files`.`id` = `OS_files`.`file_id` ' +
      'LEFT JOIN `OS` ON `OS_files`.`os_id` = `OS`.`id` ' +
      'WHERE `product_id` = ?';

    const data = await currentDb.query(query, [this.parent.id]);

    if (!db) {
      await currentDb.disconnect();
    }

    return data ?? [];
  }
}
