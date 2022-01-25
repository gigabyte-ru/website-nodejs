import { Updated } from './Updated';
import { DB, getDataFromDb } from '../utils';
import { Cpu, CpuOption, CpuOptionValue, ProductCpu } from './entities';

export class ProductCpus extends Updated {
  static dbName = 'u15821_products';
  static dbTables = {
    cpu: 'cpu',
    cpuParts: 'cpuparts',
    cpuPartItems: 'cpupart_items',
    cpuCpuPartItems: 'cpu_cpupart_items',
    productCpus: 'product_cpu',
  };

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
      await getDataFromDb({
        query: `SELECT * FROM \`${ProductCpus.dbTables.cpu}\``,
        db: currentDb,
      })
    ).forEach((cpu) => {
      this.cpu.set(cpu['id'], new Cpu(cpu));
    });

    (
      await getDataFromDb({
        query: `SELECT * FROM \`${ProductCpus.dbTables.cpuParts}\``,
        db: currentDb,
      })
    ).forEach((c) => {
      this.cpuOptions.set(c['id'], new CpuOption(c));
    });

    (
      await getDataFromDb({
        query: `SELECT * FROM \`${ProductCpus.dbTables.cpuPartItems}\``,
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
      await getDataFromDb({
        query: `SELECT * FROM \`${ProductCpus.dbTables.cpuCpuPartItems}\``,
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
      await getDataFromDb({
        query: `SELECT * FROM \`${ProductCpus.dbTables.productCpus}\``,
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
