import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { AgrosulLocationService } from '../../services/domain/agrosulLocation.service';
import { ClientService } from '../../services/domain/client.service';
import { AgrosulLocationDTO } from '../../models/agrosulLocationDTO';
import { ClientDTO } from '../../models/clientDTO';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Chart } from 'chart.js';
import { AreaChartService } from '../../services/domain/area-chart.service';
import { SeedTypeDTO } from '../../models/seedTypeDTO';
import { AreaChartDTO } from '../../models/charts/areaChartDTO';
import { ColorChartUtils } from '../../Utils/color-charts-utils';
import { ModalController } from 'ionic-angular';
import { MachineChartService } from '../../services/domain/machine-chart.service';
import { MachineModelChartDTO } from '../../models/charts/machineModelChartDTO';
import { MachineBrandService } from '../../services/domain/machineBrand.service';
import { MachineBrandDTO } from '../../models/machineBrandDTO';
import { MachineModelService } from '../../services/domain/machineModel.service';
import { ChartUtils } from '../../Utils/charts-utils';
import { Machinechart } from '../../charts/machine-chart';

@IonicPage()
@Component({
  selector: 'page-area-charts',
  templateUrl: 'area-charts.html',
})
export class AreaChartsPage {

  @ViewChild(Content) content: Content;

  @ViewChild('barCanvas') barCanvas;
  @ViewChild('pieCanvas') pieCanvas;

  @ViewChild('pieCanvasCompared') pieCanvasCompared;
  @ViewChild('barCanvasCompared') barCanvasCompared;
  @ViewChild('barCanvasDetail') barCanvasDetail;
  @ViewChild('barCanvasDetailOwner') barCanvasDetailOwner;

  @ViewChild('barCanvasMachinesByBrand') barCanvasMachinesByBrand;
  @ViewChild('barCanvasMachinesByYear') barCanvasMachinesByYear;
  @ViewChild('barCanvasMachinesByYearNoDetail') barCanvasMachinesByYearNoDetail;

  @ViewChild('barCanvasBrandsByYear') barCanvasBrandsByYear;

  @ViewChild('filtersSel') filtersSel;

  formGroup: FormGroup;

  formGroup2: FormGroup;

  pieChart: Chart;
  barChart: Chart;

  pieChartCompared: Chart;
  barChartCompared: Chart;
  barChartDetail: Chart;

  barChartMachineByBrand: Chart;
  barChartMachineByYear: Chart;
  barChartMachineByYearNoDetail: Chart;

  barChartBrandsByYear: Chart;


  barChartDetailOwner: Chart;

  public columns: any;

  agLocation: AgrosulLocationDTO[] = [];
  agClients: ClientDTO[] = [];
  clientList: ClientDTO[] = [];
  agSeeds: SeedTypeDTO[] = [];
  agSeedsTotal: SeedTypeDTO[] = [];
  items: AreaChartDTO[] = [];
  color: ColorChartUtils;
  mapTpSeed: Map<String, number[]> = new Map<String, number[]>();
  isenabled: boolean = false;
  machineItems: MachineModelChartDTO[] = [];
  machineBrandId: any = 0;
  machineBrand: MachineBrandDTO[] = [];
  lastbrandName: string = "";
  lastTypeMachine: String = "";
  rows: MachineModelChartDTO[] = [];
  clientName: String = ""
  listAno: String[] = [];
  totalAreaGP: number = 0;
  totalAreaAlgodao: number = 0;
  somaCvGp: number = 0;

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public agrosulLocationService: AgrosulLocationService,
    public machineChartService: MachineChartService,
    public machineBrandService: MachineBrandService,
    public areaChartService: AreaChartService,
    public clientService: ClientService,
    public machineModelService: MachineModelService,
    public formBuiler: FormBuilder,
    public machineCharts : Machinechart) {
    this.color = new ColorChartUtils()
    this.formGroup = formBuiler.group({
      farmAreaType: [] = [],
      agLocationValue: [] = [],
      agLocationName: [] = [""],
      clientValue: [] = [],
      clientTotalMaquinas: [] = [0],
      farmArea: [] = [],
      compareData: [] = [],
      chartTypeX: "marca",
      chartTypeY: String,
      lineLimit: [] = [9999],
      seedType: [] = [0],
      clientSize: [] = [0],
      areaSize: [] = [0],
      sum: [] = [0],

      sumMaquinas: [] = [0],
      sumNumberMaquinas: [] = [0],
      sumMaquinasRegiao: [] = [0],
      sumGP: [] = [0],
      sumPotMachine: [] = [0],

      sumClientTotalCultiv: [] = [0],
      sumClientSoja: [] = [],
      sumClientMilho: [] = [],
      sumClientAlgodao: [] = [],
      sumClientFeijao: [] = [],

      mediaMaquinaGp: [] = [0],
      clientName: " ",
      clientId: " ",
      lastbrandName: "",
      lastTypeMachine: "",
      anoMaquinaValue: [] = [],
      pctRegiao: [] = [0],
      dualValue2: { lower: 50, upper: 600 },
      lower: 50,
      upper: 600
    });
    this.columns = [
      { prop: 'id' },
      { name: 'name' },
      { name: 'isClienteAgrosul' }
    ];
  }

  async submitForm(event) {
    if (this.barChart == null) {
      await this.createAgrosulAllPieChart();
    }
    this.createLocationAreaPieChart();
    this.generateAreaTotal("GP");
  }

  generateAreaTotal(porteCliente) {
    this.areaChartService.getTotalAreaCultivGP(
      this.getRegioes(),
      porteCliente
    ).subscribe(response => {
      this.totalAreaGP = response[0]["totalMilho"] + response[0]["totalSoja"] + response[0]["totalAlgodao"] + response[0]["totalFeijao"];
      this.totalAreaAlgodao = response[0]["totalAlgodao"];
    });
  }

  private getAnoMaquinaSelected() {
    return this.formGroup.value.anoMaquinaValue == null ? "" : this.formGroup.value.anoMaquinaValue;

  }

  async createAgrosulAllPieChart() {
    this.isenabled = true;
    var response = await this.machineChartService
      .findByFilters(
        0,
        0,
        '',
        [0],
        0,
        '',
        this.getAnoMaquinaSelected(),
        'marca',
        'DESC',
        this.formGroup.value.lineLimit
      ).toPromise();
    this.machineCharts.setMachineItems(response);
    var label = this.machineCharts.getLabels();
    var data = this.machineCharts.getData();
    var soma = this.machineCharts.getSoma();
    this.formGroup.controls.sumNumberMaquinas.setValue(soma);
    this.formGroup.controls.sumMaquinas.setValue(this.formatarNumero(soma));
    return this.createPieChart(label, data)
  }

  setCultivTotal(total: number, key: String) {
    if (key == ChartUtils.CULTIV_TYPE_SOJA)
      this.formGroup.controls.sumSoja.setValue(this.formatarNumero(total));
    else if (key == ChartUtils.CULTIV_TYPE_MILHO)
      this.formGroup.controls.sumMilho.setValue(this.formatarNumero(total));
    else if (key == ChartUtils.CULTIV_TYPE_ALGODAO)
      this.formGroup.controls.sumAlgodao.setValue(this.formatarNumero(total));
    else if (key == ChartUtils.CULTIV_TYPE_FEIJAO)
      this.formGroup.controls.sumFeijao.setValue(this.formatarNumero(total));
    else if (key == ChartUtils.CULTIV_TYPE_PECUARIA)
      this.formGroup.controls.sumPecuaria.setValue(this.formatarNumero(total));
    else if (key == ChartUtils.CULTIV_TYPE_OUTROS)
      this.formGroup.controls.sumOutros.setValue(this.formatarNumero(total));
    else if (key == ChartUtils.CULTIV_TYPE_CAFE)
      this.formGroup.controls.sumCafe.setValue(this.formatarNumero(total));
    else
      this.formGroup.controls.sumHorti.setValue(this.formatarNumero(total));

  }

  async createPieChart(labels: String[], data1: number[]) {
    var legend: string[] = [""];
    labels.forEach(function results(e, i) {
      legend[i] = e + ': ' + data1[i]
    });
    if (this.barChart == null) {
      this.barChart = new Chart(this.barCanvas.nativeElement, await this.buildChartParamns(
        'Agrosul (Todos)',
        legend,
        data1,
        labels,
        ""
      ));
    } else {
      this.barChart.data.labels = legend;
      this.barChart.data.backgroundColor = this.getBackgroundColors(labels);
      this.barChart.data.datasets.forEach((dataset) => {
        dataset.data = data1;
        dataset.backgroundColor = this.getBackgroundColors(labels);
      });
      this.barChart.update();
    }
    return await this.barChart;
  }

  async createLocationAreaPieChart(){
    this.isenabled = true;
    let response = await this.machineChartService.findByFilters(
      0,
      0,
      '',
      this.getRegioes(),
      0,
      '',
      this.getAnoMaquinaSelected(),
      'marca',
      'DESC',
      this.formGroup.value.lineLimit
    ).toPromise(); 
    this.machineCharts.setMachineItems(response);
    var label =  this.machineCharts.getLabels();
    var data=  this.machineCharts.getData();
    var soma = this.machineCharts.getSoma();
    this.formGroup.controls.sumMaquinasRegiao.setValue(this.formatarNumero(soma));
    this.createPieChartCompared(label, data);
    var totalAg = this.formGroup.value.sumNumberMaquinas;
    var totalRegiao = soma;
    this.formGroup.controls.pctRegiao.setValue(String(Math.round((totalRegiao * 100) / totalAg)) + "%");
  }

  createOnClickFunction() {
    var onClickFunction = (c, i) => {
      var e = i[0];
      if (i[0] != null) {
        var brandName = i[0]._chart.config.data.labels[e._index];
        this.findByValue(brandName.slice(0, brandName.indexOf(":")));
        this.formGroup.controls.sumGP.setValue(this.formatarNumero(this.totalAreaGP));
      }
    };
    return onClickFunction;
  }

  async buildChartParamns(title: string, legend: String[], data: Number[], labels: String[], onClickFunction) {
    var params = {
      type: 'pie',
      data: {
        labels: legend,
        datasets: [{
          label: 'Nº Maquinas',
          data: data,
          backgroundColor: this.getBackgroundColors(labels)
        }]
      }, options: {
        title: {
          display: true,
          text: title
        },
        'onClick': onClickFunction,
        animation: {
          duration: 500,
          easing: "easeOutQuart",
          onComplete: function () {
            var ch = this.chart;
            var ctx = this.chart.ctx;
            var fontSize = 16;
            var fontStyle = 'normal';
            var fontFamily = 'Helvetica Neue';
            ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            this.data.datasets.forEach(function (dataset) {
              for (var i = 0; i < dataset.data.length; i++) {
                var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                  total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                  mid_radius = model.outerRadius - 20,
                  start_angle = model.startAngle,
                  end_angle = model.endAngle,
                  mid_angle = start_angle + (end_angle - start_angle) / 2;
                var x = mid_radius * Math.cos(mid_angle);
                var y = mid_radius * Math.sin(mid_angle);
                ctx.fillStyle = '#444';
                var isHidden = ch.legend.legendItems[i].hidden;
                var percent = String(Math.round(dataset.data[i] / total * 100)) + "%";
                if (!isHidden && percent != '0%')
                  ctx.fillText(percent, model.x + x, model.y + y + 15);

              }
            });
          }
        },
        events: ['click'],
        legend: {
          display: true,
          position: 'right'
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return data.labels[tooltipItem.index];
            }
          }
        },
        hover: { animationDuration: 0 }
      }
    }
    return await params;
  }

 
  async  createPieChartCompared(labels: String[], data: number[]) {
    var legend: string[] = [""];
    labels.forEach(function results(e, i) {
      legend[i] = e + ': ' + data[i]
    });
    if (this.pieChartCompared == null) {
      this.pieChartCompared = new Chart(this.pieCanvasCompared.nativeElement,
        await this.buildChartParamns(
          'Total de Máquinas - ' + this.formGroup.value.agLocationName,
          legend,
          data,
          labels,
          this.createOnClickFunction()
        )
      );
    } else { /*TODO: Refatorar bloco do else */
      this.pieChartCompared.options.title.text = 'Total de Máquinas - ' + this.formGroup.value.agLocationName;
      this.pieChartCompared.data.labels = legend;
      this.pieChartCompared.data.backgroundColor = this.getBackgroundColors(labels);
      this.pieChartCompared.data.datasets.forEach((dataset) => {
        dataset.data = data;
        dataset.backgroundColor = this.getBackgroundColors(labels);
      });
      this.pieChartCompared.update();
    }
  }

  findMachinesByType(typeMachine) {
    this.machineBrandService.findMachinesByType(
      typeMachine.trim(),
      this.getRegioes(),
      this.getAnoMaquinaSelected()
    ).subscribe(response => {
      this.machineItems = response;
      var label: String[] = [];
      var data: number[] = [];
      var labelName = "";
      var dataValue = 0;
      var index = 0;
      var soma = 0;
      var totalByFamily = 0;
      var sPotMachine = 0
      var totalArea = this.totalAreaGP;
      var mapCvFamily: Map<String, number> = new Map<String, number>();
      this.machineItems.forEach(element => {
        if (typeMachine.trim() == 'Trator') {
          var valorCV = +element.clientName;
          if (valorCV <= 99) {
            labelName = "-99 CV"
            dataValue = element.parqueMaquinas;
          } else if (valorCV > 99 && valorCV < 200) {
            labelName = "100 - 200 CV"
            dataValue = element.parqueMaquinas;
          } else if (valorCV >= 200 && valorCV < 300) {
            labelName = "200 - 300 CV"
            dataValue = element.parqueMaquinas;
            sPotMachine += valorCV * dataValue;
          } else if (valorCV >= 300 && valorCV < 400) {
            labelName = "300 - 400 CV"
            dataValue = element.parqueMaquinas;
            sPotMachine += valorCV * dataValue;
          } else if (valorCV >= 400) {
            labelName = "+400 CV"
            dataValue = element.parqueMaquinas;
            sPotMachine += valorCV * dataValue;
          }
          if (mapCvFamily.get(labelName) != undefined && mapCvFamily.get(labelName) > 0) {
            totalByFamily = mapCvFamily.get(labelName);
            mapCvFamily.set(labelName, dataValue + totalByFamily);
            totalByFamily = 0;
          } else {
            mapCvFamily.set(labelName, dataValue);
          }
          soma += element.parqueMaquinas;
        } else {
          label[index] = element.clientName;
          data[index] = element.parqueMaquinas;
          index++;
          soma += element.parqueMaquinas;
          sPotMachine += element.parqueMaquinas;
          if (typeMachine.trim() == 'Cotton') {
            totalArea = this.totalAreaAlgodao;
          } else if (typeMachine.trim() == 'Plantadeira') {
            sPotMachine += (+element.clientName * element.parqueMaquinas);
          }
        }
      });
      var i = 0;
      if (mapCvFamily.size > 0) {
        mapCvFamily.forEach((items, key) => {
          label[i] = key;
          data[i] = items;
          i++;
        })
      }
      var media = totalArea / sPotMachine;
      this.somaCvGp = media;
      this.formGroup.controls.mediaMaquinaGp.setValue(media.toFixed(2));
      this.formGroup.controls.sumPotMachine.setValue(this.formatarNumero(sPotMachine));
      this.createBarChartDetailYear(label, data, typeMachine, soma);
    },
      error => { console.log(error) }
    );
  }

  findMachinesByBrand(typeMachine) {
    this.machineChartService.findByFilters(
      0,
      0,
      typeMachine
      ,
      this.getRegioes(),
      0,
      '',
      this.getAnoMaquinaSelected(),
      "marca",
      'DESC',
      0
    ).subscribe(response => {
      this.machineItems = response;
      var label: String[] = [];
      var data: number[] = [];
      var index = 0;
      var soma = 0;
      this.machineItems.forEach(element => {
        label[index] = element.clientName;
        data[index] = element.parqueMaquinas;
        index++;
        soma += element.parqueMaquinas;
      });
      this.createBarChartMachineByBrand(label, data, typeMachine, soma);
    },
      error => { console.log(error) }
    );
  }

  findMachinesByYear(toFindValue, typeMachine) {
    if (typeMachine.trim() == 'Trator') {
      this.machineBrandService.findMachinesByYearCvRange(
        typeMachine.trim(),
        this.getRegioes(),
        toFindValue.trim(),
        this.getAnoMaquinaSelected()
      ).subscribe(response => {
        this.machineItems = response;
        var label: String[] = [];
        var data: number[] = [];
        var index = 0;
        var soma = 0;
        this.machineItems.forEach(element => {
          label[index] = element.clientName;
          data[index] = element.parqueMaquinas;
          index++;
          soma += element.parqueMaquinas;
        });

        this.createBarChartMachineByYear(label, data, typeMachine, soma, toFindValue)
      },
        error => { console.log(error) }
      );
    } else {
      this.machineBrandService.findMachinesByYear(
        typeMachine.trim(),
        this.getRegioes(),
        toFindValue.trim(),
        this.getAnoMaquinaSelected()
      ).subscribe(response => {
        this.machineItems = response;
        var label: String[] = [];
        var data: number[] = [];
        var index = 0;
        var soma = 0;
        this.machineItems.forEach(element => {
          label[index] = element.clientName;
          data[index] = element.parqueMaquinas;
          index++;
          soma += element.parqueMaquinas;
        });
        this.createBarChartMachineByYear(label, data, typeMachine, soma, toFindValue)
      },
        error => { console.log(error) }
      );
    }
  }

  createOnClickBarChartFunction() {
    return (c, i) => {
      if (i[0] != null) {
        var e = i[0];
        var machineType = i[0]._chart.config.data.labels[e._index];
        if(machineType !=null 
           && machineType != undefined ){

             this.findMachinesByBrand(machineType);
             this.findMachinesByType(machineType);
             this.findMachinesByYearNoDetail(machineType);
          }
      }
    }
  }

  createOnClickBarChartMachineByBrandFunction() {
    return (c, i) => {
      if (i[0] != null) {
        var e = i[0];
        var brandName = i[0]._chart.config.data.labels[e._index];
        var machineType = i[0]._model.datasetLabel;
        this.findChildByValue(brandName, machineType)
      }
    }
  }

  createOnClickMachinesByYear() {
    return (c, i) => {
      if (i[0] != null) {
        var e = i[0];
        var toFindValue = i[0]._chart.config.data.labels[e._index];
        var machineType = i[0]._model.datasetLabel;
        this.findMachinesByYear(toFindValue, machineType)
      }
    }
  }

  buildBarChartParamns(labels: String[], title: string, dataSets: any, onclickFunction) {
    var chartParamns = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: dataSets,
      }, options: {
        title: {
          display: true,
          text: title,
        },
        'onClick': onclickFunction,
        "animation": {
          "duration": 500,
          "onComplete": function () {
            var chartInstance = this.chart,
              ctx = chartInstance.ctx;
            var fontSize = 14;
            var fontStyle = 'normal';
            var fontFamily = 'Helvetica Neue';
            ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                var data = dataset.data[index];
                ctx.fillText(data, bar._model.x, bar._model.y + 0);
              });
            });
          }
        },
        tooltips: {
          enabled: false
        },
        events: ['click'],
        hover: { animationDuration: 0 },
        scales: {
          xAxes: [{
            gridLines: {
              display: true,
              drawBorder: true,
              drawOnChartArea: false,
            },
            ticks: {
              autoSkip: false,
              maxRotation: 90,
              minRotation: 90,
              padding: 0,
              stepSize: 1
            }
          }]
        ,
        yAxes: [{
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            display: true,
            drawBorder: true,
            drawOnChartArea: false,
          }
        }]
       },
      }
    }
    return chartParamns;
  }

  createBarChartCompared(labels: String[], data: number[], data2: number[], clickValue: string) {
    var labelColors: String[] = [];
    let title = 'Máquinas JD x Concorrência - ' + this.formGroup.value.agLocationName
    var i = 0;
    if (labels != null)
      labels.forEach(item => {
        labelColors[i] = this.color.chartColor.get(clickValue);
        i++;
      });
    var dataSets = [{
        label: clickValue,
        data: data,
        backgroundColor: labelColors
      },
      {
        label: 'Concorrência',
        data: data2,
        backgroundColor: 'black'
      }]
    if (this.barChartCompared == null) {
      this.barChartCompared = new Chart(this.barCanvasCompared.nativeElement,
        this.buildBarChartParamns(labels,
          title,
          dataSets,
          this.createOnClickBarChartFunction()));
    } else {
      this.barChartCompared = this.updateChartData(this.barChartCompared, labels, labelColors, title, dataSets)
      this.barChartCompared.update();
    }
  }

  createClickDetailOwner(){
    return (c, i) => {
      if (i[0] != null) {
        var e = i[0];
        this.clientName = i[0]._chart.config.data.labels[e._index];
        this.formGroup.controls.clientName.setValue(this.clientName);
        this.formGroup.controls.lastbrandName.setValue(this.lastbrandName);
        this.formGroup.controls.lastTypeMachine.setValue(this.lastTypeMachine);
        this.areaChartService
          .getProprietariosByTamanhoAreaCultura(
            this.getRegioes()
            , ""
            , ""
            , ""
            , this.clientName)
          .subscribe(resp => {
            if (resp != null && resp != undefined && resp.length > 0) {
              var porteCliente = resp[0]["tamanho_cultura"];
              this.formGroup.controls.clientId.setValue(resp[0]["proprietario_id"])
              var soma = 0; // resp[0]["totalPecuaria"]+ resp[0]["totalCafe"]+resp[0]["totalHorti"]+resp[0]["totalOutros"];
              this.formGroup.controls.sumClientSoja.setValue(resp[0]["totalPecuaria"] != null ? "Pecuária: " + resp[0]["totalPecuaria"] : "");
              this.formGroup.controls.sumClientMilho.setValue(resp[0]["totalCafe"] != null ? "Café: " + resp[0]["totalCafe"] : "");
              this.formGroup.controls.sumClientAlgodao.setValue(resp[0]["totalHorti"] != null ? "Hortifruti: " + resp[0]["totalHorti"] : "");
              this.formGroup.controls.sumClientFeijao.setValue(resp[0]["totalOutros"] != null ? "Outros: " + resp[0]["totalOutros"] : "");
              if (porteCliente == ChartUtils.CLASSF_GP) {
                this.formGroup.controls.sumClientSoja.setValue(resp[0]["totalSoja"] != null ? "Soja: " + resp[0]["totalSoja"] : "");
                this.formGroup.controls.sumClientMilho.setValue(resp[0]["totalMilho"] != null ? "Milho: " + resp[0]["totalMilho"] : "");
                this.formGroup.controls.sumClientAlgodao.setValue(resp[0]["totalAlgodao"] != null ? "Algodao: " + resp[0]["totalAlgodao"] : "");
                this.formGroup.controls.sumClientFeijao.setValue(resp[0]["totalFeijao"] != null ? "Feijao: " + resp[0]["totalFeijao"] : "");
                soma = resp[0]["totalSoja"] + resp[0]["totalMilho"] + resp[0]["totalAlgodao"] + resp[0]["totalFeijao"];
              }
              this.formGroup.controls.sumClientTotalCultiv.setValue(soma + " - Ha Cultivados");
            }
          });
        this.machineBrandService
          .findMachineByBrandAndOwner(
            this.clientName,
            this.lastbrandName,
            this.lastTypeMachine,
            this.getRegioes()
          ).
          subscribe(response => {
            var detail = "";
            var somaParque = 0;
            var temp: MachineModelChartDTO[] = [];
            this.rows = response;
            var i = 0;
            this.rows.forEach(item => {
              var tipoEquip = item.tipoEquipamento.trim();
              if (tipoEquip == 'Trator')
                detail = item.cvTrator + ' CV'
              else if (tipoEquip == 'Plantadeira')
                detail = item.numLinhas + ' Linhas'
              else if (tipoEquip == 'Colheitadeira')
                detail = item.pesColheitadeira + ' pés - Tipo ' + item.tipoPlataforma
              else if (tipoEquip == 'Pulverizador')
                detail = item.tamanhoBarra + ' Metros'
              else if (tipoEquip == 'Cotton')
                detail = item.cotton
              temp[i] = item;
              temp[i].detailTable = detail;
              i++;
              somaParque += item.total;
            })
            this.rows = temp;
            this.formGroup.controls.clientTotalMaquinas.setValue(somaParque + " Máquinas   ");
            this.content.scrollToBottom(500);
          });
      }
    }
  }

  createBarChartDetailOwner(labels: String[], data: number[], clickValue: string) {
    var labelColors: String[] = [];
    var i = 0;
    labelColors = this.getBackgroundColors(labels);
    var datasets = [{
      label: clickValue,
      data: data,
      backgroundColor: labelColors
    }];
    let title = `Clientes - ${data.length}`;
    if (this.barChartDetailOwner == null) {
      this.barChartDetailOwner = new Chart(this.barCanvasDetailOwner.nativeElement, 
                                           this.buildBarChartParamns(labels, 
                                            title, 
                                            datasets, 
                                            this.createClickDetailOwner() )
                                            );
    } else {
      this.barChartDetailOwner = this.updateChartData(this.barChartDetailOwner, labels, labelColors, title, datasets);
      this.barChartDetailOwner.update();
    }
  }

  updateChartData(barChartToUpdate:Chart,labels:String[], labelColors:String[], title:string, datasets:any){
    barChartToUpdate.data.labels = labels;
    barChartToUpdate.data.backgroundColor = labelColors;
    barChartToUpdate.options.title.text = title;
    barChartToUpdate.data.datasets = datasets;
    return barChartToUpdate;
  }

  createBarChartDetailYear(labels: String[], data: number[], clickValue: string, soma: number) {
    var labelColors: String[] = [];
    labelColors = this.getBackgroundColors(labels);
    let title = 'Total de Máquinas P/ ' + this.getDetailByMachineType(clickValue) + ' - ' + soma;
    var dataset = [{
      label: clickValue,
      data: data,
      backgroundColor: labelColors
    }];
    if (this.barChartDetail == null) {
      this.barChartDetail = new Chart(this.barCanvasDetail.nativeElement,
        this.buildBarChartParamns(labels, title, dataset, this.createOnClickMachinesByYear()));
    } else {
      this.barChartDetail = this.updateChartData(this.barChartDetail, labels, labelColors, title, dataset)
      this.barChartDetail.options.scales.xAxes[0].scaleLabel.labelString = this.getDetailByMachineType(clickValue);
      this.barChartDetail.update();
    }
  }

  createOnClickOwnersByFilters(){
    return (c, i) => {
      if (i[0] != null) {
        var e = i[0];
        var brandName = i[0]._chart.config.data.labels[e._index];
        this.findOwnersByFilters(brandName);
      }
    }
  }

 createBarChartBrandsByYear(labels: String[], data: number[], clickValue, typeMachine, flHasDetail: Boolean) {
    var labelColors: String[] = [];
    var i = 0;
    labelColors = this.getBackgroundColors(labels);
    var anoModelo = localStorage.getItem('anoModelo');
    var titleText = flHasDetail ? clickValue + ' ' + this.getDetailByMachineType(typeMachine) + ' - ' + anoModelo : anoModelo;
    var dataset =[{
      label: clickValue,
      data: data,
      backgroundColor: labelColors
    }];
    if (this.barChartBrandsByYear == null) {
      this.barChartBrandsByYear = new Chart(this.barCanvasBrandsByYear.nativeElement,
                                             this.buildBarChartParamns(labels, 
                                                                       titleText,
                                                                       dataset,
                                                                        this.createOnClickOwnersByFilters()));
    } else {
      this.barChartBrandsByYear = this.updateChartData( this.barChartBrandsByYear, labels, labelColors, titleText, dataset);
      this.barChartBrandsByYear.options.scales.xAxes[0].scaleLabel.labelString = this.getDetailByMachineType(clickValue);
      this.barChartBrandsByYear.update();
    }
  }

  createBarChartMachineByBrand(labels: String[], data: number[], clickValue: string, soma: number) {
    var labelColors: String[] = [];
    let title = `Total de Máquinas ${clickValue} ${soma}`;
    labelColors = this.getBackgroundColors(labels);
    var dataSets = [{
      label: clickValue,
      data: data,
      backgroundColor: labelColors
    }]
    if (this.barChartMachineByBrand == null) {
      this.barChartMachineByBrand = new Chart(this.barCanvasMachinesByBrand.nativeElement,
        this.buildBarChartParamns(labels,
          title,
          dataSets,
          this.createOnClickBarChartMachineByBrandFunction()));
    } else {
      this.barChartMachineByBrand = this.updateChartData( this.barChartMachineByBrand, labels, labelColors, title, dataSets);
      this.barChartMachineByBrand.options.scales.xAxes[0].scaleLabel.labelString = this.getDetailByMachineType(clickValue);
      this.barChartMachineByBrand.update();
    }
  }

  createOnClickMachineByType(){
    return (c, i) => {
      if (i[0] != null) {
        var e = i[0];
        var anoModelo = i[0]._chart.config.data.labels[e._index];
        var machineType = i[0]._model.datasetLabel;
        this.findBrandsbyYearMachine(anoModelo, machineType, true);
      }
    }
  }

  createBarChartMachineByYear(labels: String[], data: number[], clickValue: string, soma: number, prevClickValue: string) {
    var labelColors: String[] = [];
    labelColors = this.getBackgroundColors(labels);
    localStorage.setItem('prevClickValue', prevClickValue);
    let title =  `${clickValue} ${prevClickValue} ${this.getDetailByMachineType(clickValue)}`; 
    var  datasets = [{
      label: clickValue,
      data: data,
      backgroundColor: labelColors
    }]
    if (this.barChartMachineByYear == null) {
      this.barChartMachineByYear = new Chart(this.barCanvasMachinesByYear.nativeElement, 
                                             this.buildBarChartParamns(labels, 
                                                title,
                                                datasets, 
                                                this.createOnClickMachineByType())
                                                );
    } else {
      this.barChartMachineByYear = this.updateChartData( this.barChartMachineByYear, labels, labelColors, title, datasets);
      this.barChartMachineByYear.options.scales.xAxes[0].scaleLabel.labelString = this.getDetailByMachineType(clickValue);
      this.barChartMachineByYear.update();
    }
  }

  processTractorNoDetail() {
    this.machineBrandService.findMachinesByYearCvRange(
      ChartUtils.MACHINE_TYPE_TRACTOR,
      this.getRegioes(),
      "",
      this.getAnoMaquinaSelected()
    ).subscribe(response => {
      this.machineItems = response;
      var label: String[] = [];
      var data: number[] = [];
      var index = 0;
      var soma = 0;
      this.machineItems.forEach(element => {
        label[index] = element.clientName;
        data[index] = element.parqueMaquinas;
        index++;
        soma += element.parqueMaquinas;
      });
      this.createBarChartMachineByYearNoDetail(label, data, ChartUtils.MACHINE_TYPE_TRACTOR, soma)
    },
      error => { console.log(error) }
    );
  }

  processMachineNoDetail(typeMachine) {
    this.machineBrandService.findMachinesByYear(
      typeMachine.trim(),
      this.getRegioes(),
      "",
      this.getAnoMaquinaSelected()
    ).subscribe(response => {
      this.machineItems = response;
      var label: String[] = [];
      var data: number[] = [];
      var index = 0;
      var soma = 0;
      this.machineItems.forEach(element => {
        label[index] = element.clientName;
        data[index] = element.parqueMaquinas;
        index++;
        soma += element.parqueMaquinas;
      });
      this.createBarChartMachineByYearNoDetail(label, data, typeMachine, soma)
    },
      error => { console.log(error) }
    );
  }

  findMachinesByYearNoDetail(typeMachine) {
    if (typeMachine != undefined && typeMachine.trim() == ChartUtils.MACHINE_TYPE_TRACTOR) {
      this.processTractorNoDetail();
    } else {
      this.processMachineNoDetail(typeMachine);
    }
  }

  createOnClickBrandsYear() {
    return (c, i) => {
      if (i[0] != null) {
        var e = i[0];
        var anoModelo = i[0]._chart.config.data.labels[e._index];
        var machineType = i[0]._model.datasetLabel;
        this.findBrandsbyYearMachine(anoModelo, machineType, false);
      }
    }
  }

  createBarChartMachineByYearNoDetail(labels: String[], data: number[], clickValue: string, soma: number) {
    var labelColors: String[] = [];
    labelColors = this.getBackgroundColors(labels);
    let title = clickValue + " Por Ano ";
    var dataset = [{
      label: clickValue,
      data: data,
      backgroundColor: labelColors
    }];
    if (this.barChartMachineByYearNoDetail == null) {
      this.barChartMachineByYearNoDetail = new Chart(this.barCanvasMachinesByYearNoDetail.nativeElement,
        this.buildBarChartParamns(labels,
          title,
          dataset,
          this.createOnClickBrandsYear()));
    } else {
      this.barChartMachineByYearNoDetail = this.updateChartData( this.barChartMachineByYearNoDetail, labels, labelColors, title, dataset);
      this.barChartMachineByYearNoDetail.options.scales.xAxes[0].scaleLabel.labelString = this.getDetailByMachineType(clickValue);
      this.barChartMachineByYearNoDetail.update();
    }
  }

  findByValue(clickValue) {
    this.machineBrandService.findBrandByName(clickValue)
      .subscribe(item => {
        this.machineBrandId = item['id'];
        this.machineChartService.findByFilters(
          this.machineBrandId,
          0,
          "",
          this.getRegioes(),
          0,
          '',
          this.getAnoMaquinaSelected(),
          "equipamento",
          'DESC',
          0
        ).subscribe(response => {
          console.log(response)
          this.machineItems = response;
          var label: String[] = [];
          var data: number[] = [];
          var data2: number[] = [];
          var index = 0;
          var soma = 0;
          this.machineItems.forEach(element => {
            label[index] = element.clientName;
            data[index] = element.parqueMaquinas;
            index++;
            soma += element.parqueMaquinas;
          });
          if (clickValue == 'John Deere') {
            var i = 0;
            this.machineBrandService.findConcurrencyByTypeMachine(label, this.getRegioes(), this.getAnoMaquinaSelected())
              .subscribe(resp => {
                console.log(resp)
                label.forEach(lbl => {
                  if (resp[i] != undefined)
                    data2[i] = resp[i]['total'];
                  else
                    data2[i] = 0;
                  i++;
                })
                this.createBarChartCompared(label, data, data2, clickValue);
              });
          } else
            this.createBarChartCompared(label, data, null, clickValue);
        },
          error => { console.log(error) }
        );
      });
  }

  findBrandsbyYearMachine(anoModelo, typeMachine, hasDetail) {
    var prevClickValue = hasDetail ? localStorage.getItem('prevClickValue').trim() : "";
    localStorage.setItem('anoModelo', anoModelo);
    localStorage.setItem('typeMachine', typeMachine);
    localStorage.setItem('especificacao', prevClickValue)
    if (typeMachine.trim() == 'Trator') {
      this.machineBrandService
        .findOwnersByYearCvRange(
          typeMachine.trim(),
          this.getRegioes(),
          prevClickValue,
          anoModelo.trim(),
          "marca",
          null).subscribe(
            response => {
              this.machineItems = response;
              var label: String[] = [];
              var data: number[] = [];
              var index = 0;
              this.machineItems.forEach(element => {
                label[index] = element.clientName;
                data[index] = element.parqueMaquinas;
                index++;
              });
              this.createBarChartBrandsByYear(label, data, prevClickValue, typeMachine, hasDetail);
            });
    } else {
      this.machineBrandService
        .findOwnersByYear(
          typeMachine.trim(),
          this.getRegioes(),
          prevClickValue.trim(),
          anoModelo.trim(),
          "marca",
          null
        ).subscribe(
          response => {
            this.machineItems = response;
            var label: String[] = [];
            var data: number[] = [];
            var index = 0;
            this.machineItems.forEach(element => {
              label[index] = element.clientName;
              data[index] = element.parqueMaquinas;
              index++;
            });
            this.createBarChartBrandsByYear(label, data, prevClickValue, typeMachine, hasDetail);
          });
    }
  }

  findOwnerbyYearMachine(anoModelo, typeMachine, especificacao, brandName) {
    this.lastbrandName = brandName;
    this.lastTypeMachine = typeMachine;
    if (typeMachine.trim() == 'Trator') {
      this.machineBrandService
        .findOwnersByYearCvRange(
          typeMachine.trim(),
          this.getRegioes(),
          especificacao.trim(),
          anoModelo.trim(),
          "proprietario",
          brandName
        ).subscribe(
          response => {
            this.machineItems = response;
            var label: String[] = [];
            var data: number[] = [];
            var index = 0;
            this.machineItems.forEach(element => {
              label[index] = element.clientName;
              data[index] = element.parqueMaquinas;
              index++;
            });
            this.createBarChartDetailOwner(label, data, typeMachine);
          });
    } else {
      this.machineBrandService
        .findOwnersByYear(
          typeMachine.trim(),
          this.getRegioes(),
          especificacao.trim(),
          anoModelo.trim(),
          "proprietario",
          brandName
        ).subscribe(
          response => {
            this.machineItems = response;
            var label: String[] = [];
            var data: number[] = [];
            var index = 0;
            this.machineItems.forEach(element => {
              label[index] = element.clientName;
              data[index] = element.parqueMaquinas;
              index++;
            });
            this.createBarChartDetailOwner(label, data, typeMachine);
          });
    }
  }

  findOwnersByFilters(brandName) {
    var anoModelo = localStorage.getItem('anoModelo');
    var typeMachine = localStorage.getItem('typeMachine');
    var especificacao = localStorage.getItem('especificacao');
    this.findOwnerbyYearMachine(anoModelo, typeMachine, especificacao, brandName)

  }

  findChildByValue(brandName, typeMachine) {
    this.lastbrandName = brandName;
    this.lastTypeMachine = typeMachine;
    this.machineBrandService.findBrandByName(brandName)
      .subscribe(item => {
        this.machineBrandId = item['id'];
        this.machineChartService.findByFilters(
          this.machineBrandId,
          0,
          typeMachine
          ,
          this.getRegioes(),
          0,
          '',
          this.getAnoMaquinaSelected(),
          "proprietario",
          'DESC',
          55
        ).subscribe(response => {
          this.machineItems = response;
          var label: String[] = [];
          var data: number[] = [];
          var index = 0;
          this.machineItems.forEach(element => {
            label[index] = element.clientName;
            data[index] = element.parqueMaquinas;
            index++;
          });
          this.createBarChartDetailOwner(label, data, typeMachine);
        },
          error => { console.log(error) }
        );
      });
  }

  ionViewDidLoad() {
    this.loadAgrosulLocation(localStorage.getItem('userId'));
    this.loadAnoModelo();
  }

  loadSeedType() {
    this.areaChartService.listAllSeedType()
      .subscribe(
        response => {
          this.agSeeds = response
        },
        error => { console.log(error) }
      );
  }

  loadAgrosulLocation(userID) {
    if (localStorage.getItem('role') == 'admin') {
      var todos = new AgrosulLocationDTO();
      todos.id = '0';
      todos.locationName = 'Todos';
      this.agLocation.push(todos);

      todos = new AgrosulLocationDTO();
      todos.id = '901';
      todos.locationName = 'Agrosul 1 - BA/TO';
      this.agLocation.push(todos);

      todos = new AgrosulLocationDTO();
      todos.id = '902';
      todos.locationName = 'Agrosul 2 - PI';
      this.agLocation.push(todos);
    }
    this.agrosulLocationService.findAllByUserId(userID)
      .subscribe(response => {
        response.forEach(iten => {
          todos = new AgrosulLocationDTO();
          todos.id = iten.id;
          todos.locationName = iten.locationName;
          this.agLocation.push(todos);
        });
        if (this.agLocation != undefined || this.agLocation != null) {
          this.isenabled = true;
          this.formGroup.controls.agLocationValue.setValue(this.agLocation[0].id)
        }
      },
        error => {
          console.log(error);
        });
  }

  loadClients() {
    this.clientService.findAllNames()
      .subscribe(response => {
        this.agClients = response
      },
        error => {
          console.log(error);
        });
  }

  detailClient(client: ClientDTO) {
    var cli: ClientDTO[] = [client];
    var data = { selectedClient: cli };
    var modalPage = this.modalCtrl.create('ClientPage', data);
    modalPage.present();
  }

  loadDetail() {
    this.clientService.findAllFarmsByAgLocation(this.formGroup.value.agLocationValue,
      0)
      .subscribe(response => {

        this.formGroup2.controls.clientsValue.setValue(response);
        this.clientList = response;
        this.formGroup2.controls.typeClientValue.setValue(response[0].typeClient.typeName);
        this.formGroup2.controls.clientPhoneNumber.setValue(response[0].farms[0].phoneNumber);
        this.formGroup2.controls.farmsDetailName.setValue(response[0].farms[0].farmName);
        this.formGroup2.controls.agAgrosulLocation.setValue(response[0].farms[0].agrosulLocation.locationName);
        this.formGroup2.controls.farmAreaType.setValue(response[0].farms[0].farmFields[0].farmFielType.typeName);
        this.formGroup2.controls.farmAreaType.setValue(response[0].farms[0].farmFields[0].farmFielType.typeName);
      },
        error => {
          console.log(error);
        });
  }

  loadAnoModelo() {
    this.machineModelService.findAllAnoModelo()
      .subscribe(response => {
        this.listAno = response
      },
        error => {
          console.log(error);
        });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.clientList.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.formGroup2.controls.clientsValue.setValue(temp);
  }

  formatarNumero(n) {
    var n = n.toString();
    var r = '';
    var x = 0;
    for (var i = n.length; i > 0; i--) {
      r += n.substr(i - 1, 1) + (x == 2 && i != 1 ? '.' : '');
      x = x == 2 ? 0 : x + 1;
    }
    return r.split('').reverse().join('');
  }

  getBackgroundColors(labels) {
    var backgroudColors: String[] = [];
    var i = 0;
    labels.forEach(key => {
      var cor = this.color.chartColor.get(key);
      if (cor == undefined)
        cor = ColorChartUtils.getRandomColor();
      backgroudColors[i] = cor;
      i++;
    });
    return backgroudColors;
  }

  getRegioes() {
    this.selectLocation();
    var regioes = [0];
    if (this.formGroup.value.agLocationValue == '901') {
      regioes = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    } else if (this.formGroup.value.agLocationValue == '902') {
      regioes = [15, 16, 17];
    } else {
      regioes = this.formGroup.value.agLocationValue
    }
    return regioes;
  }

  selectLocation() {
    if (this.formGroup.value.agLocationValue != undefined
      && this.formGroup.value.agLocationValue != null
      && this.formGroup.value.agLocationValue.length == 0) {
      this.formGroup.controls.agLocationValue.setValue(this.agLocation[0].id)
    }
  }

  getDetailByMachineType(clickValue) {
    if (clickValue.trim() == 'Trator')
      return ' CV '
    else if (clickValue.trim() == 'Plantadeira')
      return 'Linhas'
    else if (clickValue.trim() == 'Colheitadeira')
      return ' Pés '
    else if (clickValue.trim() == 'Pulverizador')
      return ' Metros '
    else if (clickValue.trim() == 'Cotton')
      return ' Tipo '
  }

  async goToDetail() {
    var data: any;
    var cli: ClientDTO;
    let id = this.formGroup.value.clientId;
    cli = await this.clientService.findById(id).toPromise();
    data = { selectedClient: cli };
    this.navCtrl.push('ClientHoldTabsPage', data);
  }

  onChange(ev: any) {
    this.formGroup.controls.lower.setValue(ev._valA);
    this.formGroup.controls.upper.setValue(ev._valB);
  }

  getValueFromLocation(locationName) {
    this.formGroup.controls.agLocationName.setValue(locationName);
  }
}