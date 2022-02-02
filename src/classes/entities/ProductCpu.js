import { Entity } from './Entity';

export class ProductCpu extends Entity {
  constructor(productCpuDb, cpu) {
    super(productCpuDb);

    this.bios = productCpuDb['bios'];
    this.sorder = productCpuDb['sorder'];

    this.cpu = cpu;
  }
}
