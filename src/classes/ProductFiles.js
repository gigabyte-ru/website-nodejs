import { DB } from '../utils/index.js';
import { Updated } from './Updated.js';
import { File } from './entities/File.js';
import { FileGroup } from './entities/FileGroup.js';
import { FileType } from './entities/FileType.js';
import { Os } from './entities/Os.js';
import { ProductFile } from './entities/ProductFile.js';

export class ProductFiles extends Updated {
  static dbName = 'u15821_products';

  data = new Map();

  files = new Map();
  fileGroups = new Map();
  fileTypes = new Map();
  os = new Map();
  fileOS = new Map();

  get(productId) {
    return this.data.get(productId);
  }

  async fill(db) {
    const currentDb = db ?? (await DB().connect(ProductFiles.dbName));

    (
      await this.getDataFromDb({
        query: 'SELECT * FROM `files`',
        db: currentDb,
      })
    ).forEach((f) => {
      this.files.set(f['id'], new File(f));
    });

    (
      await this.getDataFromDb({
        query: 'SELECT * FROM `file_groups`',
        db: currentDb,
      })
    ).forEach((f) => {
      this.fileGroups.set(f['id'], new FileGroup(f));
    });

    (
      await this.getDataFromDb({
        query: 'SELECT * FROM `file_types`',
        db: currentDb,
      })
    ).forEach((f) => {
      this.fileTypes.set(f['id'], new FileType(f));
    });

    (
      await this.getDataFromDb({
        query: 'SELECT * FROM `OS`',
        db: currentDb,
      })
    ).forEach((f) => {
      this.os.set(f['id'], new Os(f));
    });

    (
      await this.getDataFromDb({
        query: 'SELECT * FROM `OS_files`',
        db: currentDb,
      })
    ).forEach((f) => {
      const os = this.os.get(f['os_id']);
      const fileId = f['file_id'];
      if (os) {
        if (this.fileOS.has(fileId)) {
          this.fileOS.get(fileId).push(os);
        } else {
          this.fileOS.set(fileId, [os]);
        }
      }
    });

    (
      await this.getDataFromDb({
        query: 'SELECT * FROM `product_files`',
        db: currentDb,
      })
    ).forEach((f) => {
      const productId = f['product_id'];
      const file = this.files.get(f['file_id']);

      if (file) {
        const productFile = new ProductFile(
          file,
          this.fileGroups,
          this.fileTypes,
          this.fileOS
        );
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
