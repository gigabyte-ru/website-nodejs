import { DB, getDataFromDb } from '../utils';
import { Updated } from './Updated';
import { File, FileGroup, FileType, Os, ProductFile, OsFile } from './entities';

export class ProductFiles extends Updated {
  static dbName = 'u15821_products';
  static dbTables = {
    files: 'files',
    fileGroups: 'file_groups',
    fileTypes: 'file_types',
    os: 'OS',
    osFiles: 'OS_files',
    productFiles: 'product_files',
  };

  /**
   * @type { Map<number, Array<ProductFile>> }
   */
  data = new Map();

  /**
   * @type { Map<number, File> }
   */
  files = new Map();
  /**
   * @type { Map<number, FileGroup> }
   */
  fileGroups = new Map();
  /**
   * @type { Map<number, FileType> }
   */
  fileTypes = new Map();
  /**
   * @type { Map<number, Os> }
   */
  os = new Map();
  /**
   * @type { Map<number, OsFile> }
   */
  osFiles = new Map();

  get(productId) {
    return this.data.get(productId);
  }

  async fill(db) {
    const currentDb = db ?? (await DB().connect(ProductFiles.dbName));

    (
      await getDataFromDb({
        query: `SELECT * FROM \`${ProductFiles.dbTables.files}\``,
        db: currentDb,
      })
    ).forEach((f) => {
      this.files.set(f['id'], new File(f));
    });

    (
      await getDataFromDb({
        query: `SELECT * FROM \`${ProductFiles.dbTables.fileGroups}\``,
        db: currentDb,
      })
    ).forEach((f) => {
      this.fileGroups.set(f['id'], new FileGroup(f));
    });

    (
      await getDataFromDb({
        query: `SELECT * FROM \`${ProductFiles.dbTables.fileTypes}\``,
        db: currentDb,
      })
    ).forEach((f) => {
      this.fileTypes.set(f['id'], new FileType(f));
    });

    (
      await getDataFromDb({
        query: `SELECT * FROM \`${ProductFiles.dbTables.os}\``,
        db: currentDb,
      })
    ).forEach((f) => {
      this.os.set(f['id'], new Os(f));
    });

    (
      await getDataFromDb({
        query: `SELECT * FROM \`${ProductFiles.dbTables.osFiles}\``,
        db: currentDb,
      })
    ).forEach((f) => {
      const os = this.os.get(f['os_id']);
      const fileId = f['file_id'];
      if (os) {
        if (this.osFiles.has(fileId)) {
          this.osFiles.get(fileId).addOs(os);
        } else {
          this.osFiles.set(fileId, new OsFile(f, os));
        }
      }
    });

    (
      await getDataFromDb({
        query: `SELECT * FROM \`${ProductFiles.dbTables.productFiles}\``,
        db: currentDb,
      })
    ).forEach((f) => {
      const productId = f['product_id'];
      const file = this.files.get(f['file_id']);

      if (file) {
        const productFile = new ProductFile(f, {
          file,
          fileGroups: this.fileGroups,
          fileTypes: this.fileTypes,
          osFiles: this.osFiles,
        });
        if (this.data.has(productId)) {
          this.data.get(productId).push(productFile);
        } else {
          this.data.set(productId, [productFile]);
        }
      }
    });

    if (!db) {
      await currentDb.disconnect();
    }

    return this;
  }

  log() {
    console.log(`Files: ${this.files.size}`);
    console.log(`FileGroups: ${this.fileGroups.size}`);
    console.log(`FileTypes: ${this.fileTypes.size}`);
    console.log(`OS: ${this.os.size}`);
    console.log(`${this.constructor.name}: ${this.data.size}`);

    return this;
  }
}
