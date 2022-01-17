export class ProductCpu {
  constructor(productCpuDb, cpu) {
    this.id = productCpuDb['id'];
    this.bios = productCpuDb['bios'];
    this.sorder = productCpuDb['sorder'];

    this.cpu = cpu;
  }
}
