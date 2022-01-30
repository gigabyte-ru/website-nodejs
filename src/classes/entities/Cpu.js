import { globalVariables } from '../GlobalVariables.js';

export class Cpu {
  optionValue = [];

  constructor(cpuDb) {
    this.id = cpuDb['id'];
    this.name = cpuDb['name'];
    this.markId = cpuDb['markId'];
    this.socketId = cpuDb['socketId'];
  }

  getSocket() {
    this.socket = globalVariables.variables.sockets.get(this.socketId);
  }

  setOptionValue(option, value) {
    this.optionValue.push({
      option,
      value,
    });
  }
}
