import { Entity } from './Entity';

export class CpuOptionValue extends Entity {
  constructor(cpuOptionValue) {
    super(cpuOptionValue);

    this.cpuOptionId = cpuOptionValue['cpupart_id'];
    this.value = cpuOptionValue['name'];
    this.sorder = cpuOptionValue['sorder'];
  }
}
