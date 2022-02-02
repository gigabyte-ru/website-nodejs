import { Entity } from './Entity';

export class CpuOption extends Entity {
  values = [];

  constructor(cpuOptionDb) {
    super(cpuOptionDb);

    this.name = cpuOptionDb['name'];
    this.unit = cpuOptionDb['unit'];
    this.sorder = cpuOptionDb['sorder'];
  }

  setValue(value) {
    this.values.push(value);
  }
}
