import { Updated } from './Updated.js';
import { DB } from '../utils/index.js';
import { Cpu } from './entities/Cpu.js';
import { CpuOption } from './entities/CpuOption.js';
import { CpuOptionValue } from './entities/CpuOptionValue.js';
import { ProductCpu } from './entities/ProductCpu.js';

export class ProductCpus extends Updated {
  static dbName = 'u15821_products';

  data = new Map();

  cpu = new Map();
  cpuOptions = new Map();
  cpuOptionValues = new Map();

  get(productId) {
    return this.data.get(productId) ?? null;
  }

  async fill(db) {
    const currentDb = db ?? (await DB().connect(ProductCpus.dbName));

    (
      await this.getDataFromDb({
        query: 'SELECT * FROM `cpu`',
        db: currentDb,
      })
    ).forEach((cpu) => {
      this.cpu.set(cpu['id'], new Cpu(cpu));
    });

    (
      await this.getDataFromDb({
        query: 'SELECT * FROM `cpuparts`',
        db: currentDb,
      })
    ).forEach((c) => {
      this.cpuOptions.set(c['id'], new CpuOption(c));
    });

    (
      await this.getDataFromDb({
        query: 'SELECT * FROM `cpupart_items`',
        db: currentDb,
      })
    ).forEach((c) => {
      const cpuOptionValue = new CpuOptionValue(c);
      const cpuOption = this.cpuOptions.get(cpuOptionValue.cpuOptionId);
      if (cpuOption) {
        cpuOption.setValue(cpuOptionValue);
      }
      this.cpuOptionValues.set(cpuOptionValue.id, cpuOptionValue);
    });

    (
      await this.getDataFromDb({
        query: 'SELECT * FROM `cpu_cpupart_items`',
        db: currentDb,
      })
    ).forEach((c) => {
      const cpu = this.cpu.get(c['cpu_id']);
      const cpuOption = this.cpuOptions.get(c['cpupart_id']);
      const cpuValue = this.cpuOptionValues.get(c['cpupart_item_id']);

      if (cpu && cpuOption && cpuValue) {
        cpu.setOptionValue(cpuOption, cpuValue);
      }
    });

    (
      await this.getDataFromDb({
        query: 'SELECT * FROM `product_cpu`',
        db: currentDb,
      })
    ).forEach((p) => {
      const productId = p['product_id'];
      const cpu = this.cpu.get(p['cpu_id']);

      if (productId && cpu) {
        const productCpu = new ProductCpu(p, cpu);
        if (this.data.has(productId)) {
          this.data.get(productId).push(productCpu);
        } else {
          this.data.set(productId, [productCpu]);
        }
      }
    });

    if (!db) {
      await currentDb.disconnect();
    }

    return this;
  }

  log() {
    console.log(`Cpu's: ${this.cpu.size}`);
    console.log(`CpuOptions: ${this.cpuOptions.size}`);
    console.log(`CpuOptionValues: ${this.cpuOptionValues.size}`);
    console.log(`${this.constructor.name}: ${this.data.size}`);

    return this;
  }
}
