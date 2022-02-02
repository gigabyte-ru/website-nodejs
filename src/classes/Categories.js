import { Updated } from './Updated';
import { Category } from './entities';
import { getDataFromDb } from '../utils';

export class Categories extends Updated {
  static dbName = 'u15821_products';
  static dbTables = {
    categories: 'categories',
  };

  /**
   * @type { Set<Category> }
   */
  data = new Set();

  log() {
    console.log(`${this.constructor.name}: ${this.data.size}`);
    return this;
  }

  /**
   * @param { number | string } categoryIdOrAlias
   * @return { null | Category }
   */
  get(categoryIdOrAlias) {
    for (const category of this.data.values()) {
      if (
        category.id === categoryIdOrAlias ||
        category.alias === categoryIdOrAlias
      ) {
        return category;
      }
    }

    return null;
  }

  /**
   * @param { Category } entity
   * @param {string | null} table
   */
  insertEntity(entity, table = null) {
    this.data.add(entity);

    return this;
  }

  /**
   * @param {Category} entity
   * @param {string | null} table
   */
  deleteEntity(entity, table = null) {
    this.data.delete(entity);

    return this;
  }

  /**
   * @param {Category} entity
   * @param {string | null} table
   */
  updateEntity(entity, table = null) {
    this.deleteEntity(entity);
    this.insertEntity(entity);
    return this;
  }

  /**
   * @param {number} entityId
   * @param {string | null} table
   */
  deleteEntityById(entityId, table = null) {
    for (const category of this.data.values()) {
      if (category.id === entityId) {
        this.deleteEntity(category);
      }
    }

    return this;
  }

  /**
   * @param { Array<ChangeLog> } changeLogs
   */
  async update(changeLogs = []) {
    await super.update(changeLogs);

    await this.updateDbTableEntities({
      dbName: Categories.dbName,
      table: Categories.dbTables.categories,
    }).then();

    return this;
  }

  async fill(db = null) {
    this.data = new Set();

    const categories = await getDataFromDb({
      query: `SELECT * FROM \`${Categories.dbTables.categories}\` WHERE \`original_id\` > 0`,
      dbName: Categories.dbName,
      db,
    });

    for (const category of categories) {
      this.data.add(new Category(category));
    }

    return this;
  }
}
