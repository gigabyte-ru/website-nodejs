export class CpuOptionValue {
  constructor(cpuOptionValue) {
    this.id = cpuOptionValue['id'];
    this.cpuOptionId = cpuOptionValue['cpupart_id'];
    this.value = cpuOptionValue['name'];
    this.sorder = cpuOptionValue['sorder'];
  }
}
