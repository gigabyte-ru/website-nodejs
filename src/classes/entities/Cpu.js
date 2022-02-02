import { Entity } from './Entity';

export class Cpu extends Entity {
  optionValue = [];

  constructor(cpuDb) {
    super(cpuDb);

    this.name = cpuDb['name'];
    this.markId = cpuDb['markId'];
    this.socketId = cpuDb['socketId'];
  }

  setOptionValue(option, value) {
    this.optionValue.push({
      option,
      value,
    });
  }
}
