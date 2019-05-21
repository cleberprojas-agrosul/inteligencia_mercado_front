import { MachineModelChartDTO } from "../models/charts/machineModelChartDTO";
import { Injectable } from "@angular/core";

@Injectable()
export class Machinechart {

  private machineItems: MachineModelChartDTO[] = []

  setMachineItems(machines: MachineModelChartDTO[]) {
    this.machineItems = machines;
  }

  getData(): number[] {
    let data: number[] = []
    this.machineItems.forEach((element, index) => {
      if (index <= 10) {
        data[index] = element.parqueMaquinas;
      }
    })
    return data;
  }

  getLabels(): String[] {
    let labels: String[] = []
    this.machineItems.forEach((element, index) => {
      if (index <= 10) {
        labels[index] = element.clientName;
      }
    })
    return labels;
  }

  getSoma(): number {
    let soma = 0;
    this.machineItems.forEach((element) => {
      soma += element.parqueMaquinas;
    })
    return soma;
  }
}