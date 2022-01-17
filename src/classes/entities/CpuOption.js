export class CpuOption {
  values = [];

  constructor(cpuOptionDb) {
    this.id = cpuOptionDb['id'];
    this.name = cpuOptionDb['name'];
    this.unit = cpuOptionDb['unit'];
    this.sorder = cpuOptionDb['sorder'];
  }

  setValue(value) {
    this.values.push(value);
  }
}
