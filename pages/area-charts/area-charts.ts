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
import { AreaFilterDTO } from '../../models/areaFilterDTO';
import { ColorChartUtils } from '../../Utils/color-charts-utils';
import { ModalController } from 'ionic-angular';
import { MachineChartService } from '../../services/domain/machine-chart.service';
import { MachineModelChartDTO } from '../../models/charts/machineModelChartDTO';
import { MachineBrandService } from '../../services/domain/machineBrand.service';
import { MachineBrandDTO } from '../../models/machineBrandDTO';
import { MachineModelDTO } from '../../models/machineModelDTO';
import { MachineModelService } from '../../services/domain/machineModel.service';
import { map } from 'rxjs/operators';



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

  barChartBrandsByYear: Chart;


  barChartDetailOwner: Chart;
  
  public columns : any;

  agLocation: AgrosulLocationDTO[] = [];
  agClients: ClientDTO[] = [];
  clientList: ClientDTO[] = [];
  agSeeds: SeedTypeDTO[] = [];
  agSeedsTotal: SeedTypeDTO[] = [];
  items :  AreaChartDTO[]  = [];
  color:ColorChartUtils ;
  mapTpSeed:Map<String,number[]> = new Map<String,number[]>();
  isenabled:boolean=false;
  machineItems : MachineModelChartDTO[] = [];
  machineBrandId:any=0;
  machineBrand:MachineBrandDTO[]=[];
  lastbrandName:string="";
  lastTypeMachine:String="";
  rows: MachineModelChartDTO[]=[]; 
  clientName:String=""
  listAno: String[] = [];


  constructor(
     public modalCtrl : ModalController,
     public navCtrl: NavController,
     public navParams: NavParams,
     public agrosulLocationService: AgrosulLocationService,
     public machineChartService :  MachineChartService,
     public machineBrandService: MachineBrandService,
     public areaChartService: AreaChartService,
     public clientService: ClientService,
     public machineModelService: MachineModelService,
     public formBuiler:FormBuilder) {
      this.color = new ColorChartUtils()
      this.formGroup = formBuiler.group({
				farmAreaType:[] =[],
        agLocationValue:[]=[0],
        agLocationName:[]=[""],
        clientValue:[]=[],
        clientTotalMaquinas:[]=[0],
				farmArea:[]=[],
				compareData:[] = [],
        chartTypeX:"marca",
        chartTypeY:String,
        lineLimit:[]=[9999],
        seedType:[]=[0],
        clientSize:[]=[0],
        areaSize:[]=[0],
        sum:[]=[0],

        sumMaquinas:[]=[0],
        sumNumberMaquinas:[]=[0],
        sumMaquinasRegiao:[]=[0],
        AllBrands:[]=[""],
        clientName:" ",
        lastbrandName:"",
        lastTypeMachine:"",
        anoMaquinaValue:[]=[""],
        pctRegiao:[]=[0],
        dualValue2: {lower: 50, upper: 600},
        lower:50,
        upper:600
      });

      this.formGroup2 = formBuiler.group({
        clientsValue:[]=[0],
        typeClientValue:[]=[0],
        farms:[]=[0],
        farmsDetail:[]=[0],
        farmsDetailName:[] = [],
        farmsLocation:[] = [],
        
        clientPhoneNumber:[] = [],
        clientObs:[] = [],

        agAgrosulLocation:[] = [0],

        farmFields:[] =[],
        farmsFieldName:[] = [],
        farmsFieldTotalArea:[] = [],

        farmAreas:[] =[0],
        farmAreaType:[] = [0],
        farmAreaTotal:[] = [0],

        farmCultivAreas:[] =[0],
        farmSeed:[] = [0],
        farmTotalAreaSeed:[] = [0],
        farmHarvestNum:[] = [0],

        workMachines:[] =[0],
        machineModel:[] = [0],
        machineBrand:[] = [0],
        machineBrandId:[] = [0],
        machineQtd:[] = [0],

        concessionaria:[]=[0],
        typeMachine:[] = [0],
        cottonType:[] = [0],
        harvesterFeet:[] = [0],
        harvesterHeadType:[] = [0],
        planterBetweenLines:[] = [0],
        planterLineNumbers:[] = [0],
        solidDistVolume:[] = [0],
        sprayerBarLength:[] = [0],
        tractorHorsePower:[] = [0],
      });
      
      this.columns = [
        { prop: 'id' },
        { name: 'name' },
        { name: 'isClienteAgrosul' }
      ];
  }

  submitForm(event): void {
    if(this.barChart == null){
      this.createMultiLevelBartChart();
    }
    this.addNew();
}

createMultiLevelBartChart(){
  this.isenabled=true;
  this.machineChartService.findByFilters(
		0,
    0,
    '',
		[0],
		0,
    '',
    this.formGroup.value.anoMaquinaValue,
    'marca',
    'DESC',
		this.formGroup.value.lineLimit
		).subscribe(response=>{
			this.machineItems = response;
			var label: String[] = [];
			var data: number[] = [];
			var index = 0;
      var soma=0;
      var allBrandsName: String[]=[];
			this.machineItems.forEach(element => {
        allBrandsName[index] = element.clientName;
        if(index <= 10){
          label[index] = element.clientName;
          data[index]  = element.parqueMaquinas;
        }
        index++;
				soma += element.parqueMaquinas;
      });
      this.formGroup.controls.AllBrands.setValue(allBrandsName);
      this.formGroup.controls.sumNumberMaquinas.setValue(soma);
      this.formGroup.controls.sumMaquinas.setValue(this.formatarNumero(soma));
       
      this.createPieChart(label,data)
		},
		error =>{console.log(error)}
	);	 	    
}

setCultivTotal(total:number,key:String){
  if(key=='Soja')
     this.formGroup.controls.sumSoja.setValue(this.formatarNumero(total));
  else   if(key=='Milho')
     this.formGroup.controls.sumMilho.setValue(this.formatarNumero(total));
  else   if(key=='Algodao')
     this.formGroup.controls.sumAlgodao.setValue(this.formatarNumero(total));
  else   if(key=='Feijao')
     this.formGroup.controls.sumFeijao.setValue(this.formatarNumero(total));
  else   if(key=='Pecuaria')
     this.formGroup.controls.sumPecuaria.setValue(this.formatarNumero(total));
  else   if(key=='Outros')
     this.formGroup.controls.sumOutros.setValue(this.formatarNumero(total));
  else   if(key=='Cafe')
     this.formGroup.controls.sumCafe.setValue(this.formatarNumero(total));
  else   
     this.formGroup.controls.sumHorti.setValue(this.formatarNumero(total));

}

createPieChart(labels,data1){
  var legend:string[]=[""];
  labels.forEach( function results(e,i){
      legend[i]=e +': '+ data1[i]                      
  });
  if(this.barChart == null){
      this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: legend,
        datasets: [{
          label: 'Nº Maquinas',
          data: data1,
          backgroundColor:this.getBackgroundColors(labels)
        }]
      },options:{
        responsive: true,
        maintainAspectRatio: true,
        title: {
          display: true,
          text: 'Total Máquinas (todos) '
        },
        animation: {
          duration: 500,
          easing: "easeOutQuart",
          onComplete: function () {
            var ch =  this.chart;
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
                    mid_radius = model.outerRadius-20,
                    start_angle = model.startAngle,
                    end_angle = model.endAngle,
                    mid_angle = start_angle + (end_angle - start_angle)/2;
                var x = mid_radius * Math.cos(mid_angle);
                var y = mid_radius * Math.sin(mid_angle);
                ctx.fillStyle = '#444';
                var isHidden = ch.legend.legendItems[i].hidden;
                var percent = String(Math.round(dataset.data[i]/total*100)) + "%";
                if(!isHidden && percent!='0%')
                  ctx.fillText(percent, model.x + x, model.y + y + 15);
              }
            });               
          }
        },
        events: ['click'],
        legend: {
          display: true,
          position:'left'
        },
        hover: {animationDuration: 0},
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              return data.labels[tooltipItem.index];
            }
          }   
        },
     },	
    });
  }else{
    this.barChart.data.labels=legend;
    this.barChart.data.backgroundColor=this.getBackgroundColors(labels);
    this.barChart.data.datasets.forEach((dataset) => {
             dataset.data=data1;
             dataset.backgroundColor=this.getBackgroundColors(labels);
     });
    this.barChart.update();
    
  }
  return this.barChart;
}


createBarChart(labels,dataset){
	if(this.barChart == null){
      this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: dataset
      },options:{
        legend: {
          display: true,
          position:'left'
        },
        title: {
          display: true,
          text: 'Total de Máquinas Região '+this.formGroup.value.agLocationName
        },
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          xAxes: [{
                ticks: {
                    autoSkip: false,
                    maxRotation: 90,
                    minRotation: 90,
                    padding: 0
                  },
                  barPercentage: 0.6
                }],
          yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
            }
      }	
    });
  }else{
    this.barChart.data.labels=labels;
    this.barChart.data.datasets=dataset;
    this.barChart.data.options.title.text='Total de Máquinas Região '+this.formGroup.value.agLocationName;
    this.barChart.type='bar';
    this.barChart.update();
  }
  return this.barChart;
}


addNew():void{
  this.isenabled=true;
  this.machineChartService.findByFilters(
		0,
    0,
    '',
		this.getRegioes(),
		0,
    '',
    this.formGroup.value.anoMaquinaValue,
    'marca',
    'DESC',
		this.formGroup.value.lineLimit
		).subscribe(response=>{
			this.machineItems = response;
			var label: String[] = [];
			var data: number[] = [];
			var index = 0;
      var soma=0;
      var allBrandsName: String[]=[];
			this.machineItems.forEach(element => {
        allBrandsName[index] = element.clientName;
        if(index <= 10){
          label[index] = element.clientName;
          data[index]  = element.parqueMaquinas;
        }
        index++;
				soma += element.parqueMaquinas;
      });
      this.formGroup.controls.AllBrands.setValue(allBrandsName);
      this.formGroup.controls.sumMaquinasRegiao.setValue(this.formatarNumero(soma));
      this.createPieChartCompared(label,data);

      var totalAg     = this.formGroup.value.sumNumberMaquinas;
      var totalRegiao =soma;
      this.formGroup.controls.pctRegiao.setValue(String(Math.round( (totalRegiao*100) / totalAg)) + "%");
		},
		error =>{console.log(error)}
	);	 	     
 }

 createPieChartCompared(labels:String[], data:number[]){
  var legend:string[]=[""];
  labels.forEach( function results(e,i){
      legend[i]=e +': '+ data[i]                      
  });
  if(this.pieChartCompared == null){
      this.pieChartCompared = new Chart(this.pieCanvasCompared.nativeElement, {
        type: 'pie',
        data: {
          labels: legend,
          datasets: [{
            label: 'Nº Maquinas',
            data: data,
            backgroundColor:this.getBackgroundColors(labels)
          }]
        },options:{
          title: {
            display: true,
            text: 'Total de Máquinas -' +this.formGroup.value.agLocationName
          },
          'onClick': (c,i)=> {
            var e = i[0] ;
            if(i[0]!=null){
              var brandName=i[0]._chart.config.data.labels[e._index];
              this.findByValue(brandName.slice(0,brandName.indexOf(":")));
            }
        },
        animation: {
          duration: 500,
          easing: "easeOutQuart",
          onComplete: function () {
            var ch =  this.chart;
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
                    mid_radius = model.outerRadius-20,
                    start_angle = model.startAngle,
                    end_angle = model.endAngle,
                    mid_angle = start_angle + (end_angle - start_angle)/2;
                var x = mid_radius * Math.cos(mid_angle);
                var y = mid_radius * Math.sin(mid_angle);
                ctx.fillStyle = '#444';
                var isHidden = ch.legend.legendItems[i].hidden;
                var percent = String(Math.round(dataset.data[i]/total*100)) + "%";
                if(!isHidden && percent!='0%')
                  ctx.fillText(percent, model.x + x, model.y + y + 15);
               
              }
            });               
          }
        },
        events: ['click'],
        legend: {
          display: true,
          position:'right'
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              return data.labels[tooltipItem.index];
            }
          }   
        },
        hover: {animationDuration: 0}  
    }
  });
  }else{
      this.pieChartCompared.options.title.text='Total de Máquinas - '+this.formGroup.value.agLocationName;
      this.pieChartCompared.data.labels=legend;
      this.pieChartCompared.data.backgroundColor=this.getBackgroundColors(labels);
      this.pieChartCompared.data.datasets.forEach((dataset) => {
             dataset.data=data;
             dataset.backgroundColor=this.getBackgroundColors(labels);
      });
      this.pieChartCompared.update();
    }	
  }

  findMachinesByType(typeMachine){
    this.machineBrandService.findMachinesByType(
         typeMachine.trim(),
         this.getRegioes()
       ).subscribe(response=>{
         this.machineItems = response;
         var label: String[] = [];
         var data: number[] = [];
         var labelName = "";
         var dataValue = 0;
         var index = 0;
         var soma=0;
         var totalByFamily = 0;
         var mapCvFamily:Map<String,number> = new Map<String,number>();
         this.machineItems.forEach(element => {
           if( typeMachine.trim() =='Trator'){
              var valorCV = +element.clientName;
              if(valorCV <= 99){
                  labelName="-99 CV"
                  dataValue = element.parqueMaquinas;
              }else if(valorCV > 99 && valorCV <200){
                  labelName="100 - 200 CV"
                  dataValue = element.parqueMaquinas;
              }else if(valorCV > 200 && valorCV < 300){
                  labelName="200 - 300 CV"
                  dataValue = element.parqueMaquinas;
              }else if(valorCV > 300 && valorCV < 400){
                  labelName="300 - 400 CV"
                  dataValue = element.parqueMaquinas;
              }else if( valorCV > 400){
                  labelName="+400 CV"
                  dataValue = element.parqueMaquinas;
              }
              if( mapCvFamily.get(labelName)!= undefined && mapCvFamily.get(labelName)>0 ){
                   totalByFamily = mapCvFamily.get(labelName);
                   mapCvFamily.set(labelName,dataValue+totalByFamily);
                   totalByFamily=0;
              }else{
                mapCvFamily.set(labelName,dataValue);
              }
              soma += element.parqueMaquinas;
           }else{
            label[index] = element.clientName;
            data[index]  = element.parqueMaquinas;
            index++;
            soma += element.parqueMaquinas;
           }
         });
         var i = 0;
         if(mapCvFamily.size>0){
            mapCvFamily.forEach( (items,key)=>{
              label[i] = key;
              data[i]  = items;
              i++;
            })
         }
         this.createBarChartDetail(label,data,typeMachine,soma);
    
       },
      error =>{console.log(error)}
     );
  } 
  
  findMachinesByBrand(typeMachine){
    this.machineChartService.findByFilters(
         0,
         0,
         typeMachine
         ,
         this.getRegioes(),
         0,
         '',
         this.formGroup.value.anoMaquinaValue,
         "marca",
         'DESC',
         0
       ).subscribe(response=>{
         this.machineItems = response;
         var label: String[] = [];
         var data: number[] = [];
         var index = 0;
         var soma=0;
         this.machineItems.forEach(element => {
           label[index] = element.clientName;
           data[index]  = element.parqueMaquinas;
           index++;
           soma += element.parqueMaquinas;
         });
         this.createBarChartMachineByBrand(label,data,typeMachine,soma);
      },
      error =>{console.log(error)}
     );
  }

 findMachinesByYear(toFindValue,typeMachine){
  if(typeMachine.trim()=='Trator'){
    this.machineBrandService.findMachinesByYearCvRange(
          typeMachine.trim(),
          this.getRegioes(),
          toFindValue.trim()
        ).subscribe(response=>{
          this.machineItems = response;
          var label: String[] = [];
          var data: number[] = [];
          var index = 0;
          var soma=0;
          this.machineItems.forEach(element => {
            label[index] = element.clientName;
            data[index]  = element.parqueMaquinas;
            index++;
            soma += element.parqueMaquinas;
          });
        
        this.createBarChartMachineByYear(label,data,typeMachine,soma,toFindValue)
        },
      error =>{console.log(error)}
      );
  }else{
       
        this.machineBrandService.findMachinesByYear(
          typeMachine.trim(),
          this.getRegioes(),
          toFindValue.trim()
        ).subscribe(response=>{
          this.machineItems = response;
          var label: String[] = [];
          var data: number[] = [];
          var index = 0;
          var soma=0;
          this.machineItems.forEach(element => {
            label[index] = element.clientName;
            data[index]  = element.parqueMaquinas;
            index++;
            soma += element.parqueMaquinas;
          });
        this.createBarChartMachineByYear(label,data,typeMachine,soma,toFindValue)
        },
      error =>{console.log(error)}
      );
    }   
  }
  
createBarChartCompared(labels:String[], data:number[],data2:number[],clickValue:string){
   var labelColors:String[] =[];
   var i=0;
   if(labels!=null)
      labels.forEach(item=>{ 
        labelColors[i] = this.color.chartColor.get(clickValue);
        i++;
      });
   if(this.barChartCompared == null){
       this.barChartCompared = new Chart(this.barCanvasCompared.nativeElement, {
         type: 'bar',
         data: {
           labels: labels,
           datasets: [{
             label: clickValue,
             data: data,
             backgroundColor:labelColors
           },
           {
            label: 'Concorrência',
            data: data2,
            backgroundColor:'black'
          }]
         },options:{
          title: {
            display: true,
            text: 'Máquinas JD x Concorrência - ' +this.formGroup.value.agLocationName
          },
          'onClick': (c,i)=> {
            if(i[0]!=null){
              var e = i[0] ;
              var machineType = i[0]._chart.config.data.labels[e._index];
              var brandName = i[0]._model.datasetLabel;
              this.findMachinesByBrand(machineType)
              this.findMachinesByType(machineType)
            }
        },
        "animation": {
          "duration": 500,
          "onComplete": function() {
          var chartInstance = this.chart,
            ctx = chartInstance.ctx;
            var fontSize = 14;
            var fontStyle = 'normal';
            var fontFamily = 'Helvetica Neue';
            ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          this.data.datasets.forEach(function(dataset, i) {																																												
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function(bar, index) {
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
        hover: {animationDuration: 0}, 
        scales: {
          xAxes: [{
            ticks: {
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90,
                padding: 0
              }
            }]
        },
        yAxes:[{
          display: false          
        }]
     }
   });
   }else{
       this.barChartCompared.options.title.text='Máquinas JD x Concorrência - ' +this.formGroup.value.agLocationName;
       this.barChartCompared.data.labels=labels;
       this.barChartCompared.data.backgroundColor=labelColors;
       if( this.barChartCompared.data.datasets!=null){
        var i = this.barChartCompared.data.datasets.length;
        var dt = {
                   label: 'Nº Maquinas',
                   data: data,
                   backgroundColor:labelColors
                 };
       var i=0;
        this.barChartCompared.data.datasets.forEach((dataset) => {
             if(i==0){
               dataset.data=data;
               dataset.label=clickValue;
               dataset.backgroundColor=labelColors;
             }
             if(i==1){
               dataset.data=data2;
             } 
             i++;
            });
        this.barChartCompared.update();
       }
       
     }	
 }

 createBarChartDetailOwner(labels:String[], data:number[],clickValue:string){
  var labelColors:String[] =[];
  var i=0;
  labelColors = this.getBackgroundColors(labels);
  if(this.barChartDetailOwner == null){
      this.barChartDetailOwner = new Chart(this.barCanvasDetailOwner.nativeElement, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: clickValue,
            data: data,
            backgroundColor:labelColors
          }]
        },options:{  
          title: {
            display: true,
            text: 'Clientes - '+ data.length
          },
          'onClick': (c,i)=> {
            if(i[0]!=null){
              var e = i[0] ;
              this.clientName = i[0]._chart.config.data.labels[e._index];
             
              var brandName = i[0]._model.datasetLabel;
              this.formGroup.controls.clientName.setValue(this.clientName);
              this.formGroup.controls.lastbrandName.setValue(this.lastbrandName);
              this.formGroup.controls.lastTypeMachine.setValue(this.lastTypeMachine);
              
              this.machineBrandService
              .findMachineByBrandAndOwner(
                  this.clientName,
                  this.lastbrandName,
                  this.lastTypeMachine,
                  this.getRegioes()
                  ).
                  subscribe(response=>{
                      var detail="";
                      var somaParque =0;
                      var temp:MachineModelChartDTO[]=[];
                      this.rows = response;
                      var i=0;
                      this.rows.forEach(item=>{
                        var tipoEquip = item.tipoEquipamento.trim();
                          if(tipoEquip == 'Trator')
                             detail= item.cvTrator+' CV'
                          else if(tipoEquip == 'Plantadeira')
                             detail = item.numLinhas+' Linhas'
                          else if(tipoEquip == 'Colheitadeira')
                             detail = item.pesColheitadeira+' pés - Tipo '+item.tipoPlataforma
                          else if(tipoEquip == 'Pulverizador')
                             detail = item.tamanhoBarra+' Metros'
                          else if(tipoEquip == 'Cotton')
                             detail = item.cotton
                          temp[i]=item;
                          temp[i].detailTable = detail; 
                          i++;
                          somaParque+=item.total;
                      })
                      this.rows=temp;
                      this.formGroup.controls.clientTotalMaquinas.setValue(somaParque);
                      this.content.scrollToBottom(500);
                     
                  });
            }
          }, 
          tooltips: {
						position: 'average',
						mode: 'index',
						intersect: false,
					},           
          scales: {
            xAxes: [{
              ticks: {
                  autoSkip: false,
                  maxRotation: 90,
                  minRotation: 90,
                  padding: 0,
                }
              }],
            yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
          },
       }
  });
 }else{
     this.barChartDetailOwner.data.labels=labels;
     this.barChartDetailOwner.data.backgroundColor=labelColors;
     this.barChartDetailOwner.options.title.text='Clientes - '+ data.length
     var i = this.barChartDetailOwner.data.datasets.length;
     var dt = {
                 label: 'Clientes',
                 data: data,
                 backgroundColor:labelColors
               };
     this.barChartDetailOwner.data.datasets.forEach((dataset) => {
             dataset.data=data;
             dataset.label=clickValue;
             dataset.backgroundColor=labelColors;
         });
     this.barChartDetailOwner.update();
   }	
 }
 
 createBarChartDetail(labels:String[], data:number[],clickValue:string,soma:number){
    var labelColors:String[] =[];
    var i=0;
    labelColors = this.getBackgroundColors(labels);
    if(this.barChartDetail == null){
        this.barChartDetail = new Chart(this.barCanvasDetail.nativeElement, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: clickValue,
              data: data,
              backgroundColor:labelColors
            }]
          },options:{
            title: {
              display: true,
              text: 'Total de Máquinas P/ '+this.getDetailByMachineType(clickValue) +' - '+soma
            },
            'onClick': (c,i)=> {
              if(i[0]!=null){
                var e = i[0] ;
                var toFindValue = i[0]._chart.config.data.labels[e._index];
                var machineType = i[0]._model.datasetLabel;
                this.findMachinesByYear(toFindValue,machineType)
              }
            },
            "animation": {
              "duration": 500,
              "onComplete": function() {
              var chartInstance = this.chart,
                ctx = chartInstance.ctx;
                var fontSize = 16;
                var fontStyle = 'normal';
                var fontFamily = 'Helvetica Neue';
                ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';
              this.data.datasets.forEach(function(dataset, i) {																																												
                  var meta = chartInstance.controller.getDatasetMeta(i);
                  meta.data.forEach(function(bar, index) {
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
            hover: {animationDuration: 0},             
            scales: {
              xAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: this.getDetailByMachineType(clickValue)
                  },
                  ticks: {
                      autoSkip: false,
                      maxRotation: 90,
                      minRotation: 90,
                      padding: 0,
                      min:1
                    }
                  }],
                  yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                  }]
            },
      }
    });
   }else{
       this.barChartDetail.data.labels=labels;
       this.barChartDetail.data.backgroundColor=labelColors;
       this.barChartDetail.options.scales.xAxes[0].scaleLabel.labelString = this.getDetailByMachineType(clickValue);
       this.barChartDetail.options.title.text= 'Total de Máquinas P/ '+this.getDetailByMachineType(clickValue) +' - '+soma
       var i = this.barChartDetail.data.datasets.length;
       var dt = {
                   label: 'Clientes',
                   data: data,
                   backgroundColor:labelColors
                 };
       this.barChartDetail.data.datasets.forEach((dataset) => {
               dataset.data=data;
               dataset.label=clickValue;
               dataset.backgroundColor=labelColors;
           });
       this.barChartDetail.update();
     }	
  }

  createBarChartBrandsByYear(labels:String[], data:number[],clickValue,typeMachine,soma:number){
    var labelColors:String[] =[];
    var i=0;
    labelColors = this.getBackgroundColors(labels);
    var anoModelo = localStorage.getItem('anoModelo')
    if(this.barChartBrandsByYear == null){
        this.barChartBrandsByYear = new Chart(this.barCanvasBrandsByYear.nativeElement, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: typeMachine,
              data: data,
              backgroundColor:labelColors
            }]
          },options:{
            title: {
              display: true, 
              text:  typeMachine+' ' +clickValue+ ' '+this.getDetailByMachineType(typeMachine)+ ' - '+anoModelo
            },
            'onClick': (c,i)=> {
              if(i[0]!=null){
                var e = i[0] ;
                var brandName = i[0]._chart.config.data.labels[e._index];
                this.findOwnersByFilters(brandName);
              }
            },
            "animation": {
              "duration": 500,
              "onComplete": function() {
              var chartInstance = this.chart,
                ctx = chartInstance.ctx;
                var fontSize = 16;
                var fontStyle = 'normal';
                var fontFamily = 'Helvetica Neue';
                ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';
              this.data.datasets.forEach(function(dataset, i) {																																												
                  var meta = chartInstance.controller.getDatasetMeta(i);
                  meta.data.forEach(function(bar, index) {
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
            hover: {animationDuration: 0},             
            scales: {
              xAxes: [{
                  ticks: {
                      autoSkip: false,
                      maxRotation: 90,
                      minRotation: 90,
                      padding: 0,
                      min:1
                    }
                  }],
                  yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                  }]
            },
      }
    });
  }else{
      this.barChartBrandsByYear.data.labels=labels;
      this.barChartBrandsByYear.data.backgroundColor=labelColors;
      this.barChartBrandsByYear.options.scales.xAxes[0].scaleLabel.labelString = this.getDetailByMachineType(clickValue);
      this.barChartBrandsByYear.options.title.text=  clickValue+ ' '+this.getDetailByMachineType(typeMachine)+ ' - '+anoModelo
      var i = this.barChartBrandsByYear.data.datasets.length;
      var dt = {
                  label: 'Clientes',
                  data: data,
                  backgroundColor:labelColors
                };
      this.barChartBrandsByYear.data.datasets.forEach((dataset) => {
              dataset.data=data;
              dataset.label=typeMachine;
              dataset.backgroundColor=labelColors;
          });
      this.barChartBrandsByYear.update();
    }	
  }


createBarChartMachineByBrand(labels:String[], data:number[],clickValue:string,soma:number){
    var labelColors:String[] =[];
    var i=0;
    labelColors = this.getBackgroundColors(labels);
    if(this.barChartMachineByBrand == null){
        this.barChartMachineByBrand = new Chart(this.barCanvasMachinesByBrand.nativeElement, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: clickValue,
              data: data,
              backgroundColor:labelColors
            }]
          },options:{
            title: {
              display: true,
              text: 'Total de Máquinas  '+clickValue+' ' +soma
            },
            'onClick': (c,i)=> {
              if(i[0]!=null){
                var e = i[0] ;
                var brandName = i[0]._chart.config.data.labels[e._index];
                var machineType = i[0]._model.datasetLabel;
                this.findChildByValue(brandName,machineType)
                var posX = this.barCanvasDetailOwner.nativeElement.getBoundingClientRect().bottom
                var posY = this.barCanvasMachinesByBrand.nativeElement.getBoundingClientRect().top
                this.content.scrollTo(500,posX+posY,800)
              }
            },
            "animation": {
              "duration": 500,
              "onComplete": function() {
              var chartInstance = this.chart,
                ctx = chartInstance.ctx;
                var fontSize = 16;
                var fontStyle = 'normal';
                var fontFamily = 'Helvetica Neue';
                ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';
              this.data.datasets.forEach(function(dataset, i) {																																												
                  var meta = chartInstance.controller.getDatasetMeta(i);
                  meta.data.forEach(function(bar, index) {
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
            hover: {animationDuration: 0},             
            scales: {
              xAxes: [{
                  ticks: {
                      autoSkip: false,
                      maxRotation: 90,
                      minRotation: 90,
                      padding: 0,
                      min:1
                    }
                  }]
            },
      }
    });
  }else{
      this.barChartMachineByBrand.data.labels=labels;
      this.barChartMachineByBrand.data.backgroundColor=labelColors;
      this.barChartMachineByBrand.options.scales.xAxes[0].scaleLabel.labelString = this.getDetailByMachineType(clickValue);
      this.barChartMachineByBrand.options.title.text=  'Total de Máquinas  '+clickValue+' ' +soma
      var i = this.barChartMachineByBrand.data.datasets.length;
      var dt = {
                  label: 'Clientes',
                  data: data,
                  backgroundColor:labelColors
                };
      this.barChartMachineByBrand.data.datasets.forEach((dataset) => {
              dataset.data=data;
              dataset.label=clickValue;
              dataset.backgroundColor=labelColors;
          });
      this.barChartMachineByBrand.update();
    }	
  }

  createBarChartMachineByYear(labels:String[], data:number[],clickValue:string,soma:number,prevClickValue:string){
    var labelColors:String[] =[];
    var i=0;
    labelColors = this.getBackgroundColors(labels);
    localStorage.setItem('prevClickValue',prevClickValue);
    if(this.barChartMachineByYear == null){
        this.barChartMachineByYear = new Chart(this.barCanvasMachinesByYear.nativeElement, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: clickValue,
              data: data,
              backgroundColor:labelColors
            }]
          },options:{
            title: {
              display: true,
              text: clickValue +'-' +prevClickValue+' '+this.getDetailByMachineType(clickValue)
            },
            'onClick': (c,i)=> {
              if(i[0]!=null){
                var e = i[0] ;
                var anoModelo = i[0]._chart.config.data.labels[e._index];
                var machineType = i[0]._model.datasetLabel;
                this.findBrandsbyYearMachine(anoModelo,machineType);
               
              }
            },
            "animation": {
              "duration": 500,
              "onComplete": function() {
              var chartInstance = this.chart,
                ctx = chartInstance.ctx;
                var fontSize = 16;
                var fontStyle = 'normal';
                var fontFamily = 'Helvetica Neue';
                ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';
              this.data.datasets.forEach(function(dataset, i) {																																												
                  var meta = chartInstance.controller.getDatasetMeta(i);
                  meta.data.forEach(function(bar, index) {
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
            hover: {animationDuration: 0},             
            scales: {
              xAxes: [{
                  ticks: {
                      autoSkip: false,
                      maxRotation: 90,
                      minRotation: 90,
                      padding: 0,
                      min:1
                    }
                  }],
                yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
                }]
            },
      }
    });
  }else{
      this.barChartMachineByYear.data.labels=labels;
      this.barChartMachineByYear.data.backgroundColor=labelColors;
      this.barChartMachineByYear.options.scales.xAxes[0].scaleLabel.labelString = this.getDetailByMachineType(clickValue);
      this.barChartMachineByYear.options.title.text= clickValue +'-' +prevClickValue+' '+this.getDetailByMachineType(clickValue)
      var i = this.barChartMachineByYear.data.datasets.length;
      var dt = {
                  label: 'Clientes',
                  data: data,
                  backgroundColor:labelColors
                };
      this.barChartMachineByYear.data.datasets.forEach((dataset) => {
              dataset.data=data;
              dataset.label=clickValue;
              dataset.backgroundColor=labelColors;
          });
      this.barChartMachineByYear.update();
    }	
  }

 findByValue(clickValue){
   this.machineBrandService.findBrandByName(clickValue)
    .subscribe(item=>{
      this.machineBrandId= item['id'];
      this.machineChartService.findByFilters(
        this.machineBrandId,
        0,
        "",
        this.getRegioes(),
        0,
        '',
        this.formGroup.value.anoMaquinaValue,
        "equipamento",
        'DESC',
        0
      ).subscribe(response=>{
        this.machineItems = response;
        var label: String[] = [];
        var data: number[] = [];
        var data2: number[] = [];
        var index = 0;
        var soma=0;
        this.machineItems.forEach(element => {
          label[index] = element.clientName;
          data[index]  = element.parqueMaquinas;
          index++;
          soma += element.parqueMaquinas;
        });

        if(clickValue=='John Deere'){
          var i=0;
          this.machineBrandService.findConcurrencyByTypeMachine(label,this.getRegioes())
          .subscribe(resp=>{
           label.forEach(lbl=>{
              if(resp[i]!=undefined)
                  data2[i] = resp[i]['total'];
              else
                  data2[i] =0;    
              i++;
            })
            console.log(resp)
            this.createBarChartCompared(label,data,data2,clickValue);
          });
        }else
          this.createBarChartCompared(label,data,null,clickValue);
      },
     error =>{console.log(error)}
    );
  });
 } 

 findBrandsbyYearMachine(anoModelo,typeMachine){
  var prevClickValue = localStorage.getItem('prevClickValue');
  localStorage.setItem('anoModelo',anoModelo);
  localStorage.setItem('typeMachine',typeMachine);
  localStorage.setItem('especificacao',prevClickValue)
  
    if(typeMachine.trim()=='Trator'){
      this.machineBrandService
      .findOwnersByYearCvRange(
        typeMachine.trim(),
        this.getRegioes(),
        prevClickValue.trim(),
        anoModelo.trim(),
        "marca",
         null).subscribe(
          response=>{
          this.machineItems = response;
          var label: String[] = [];
          var data: number[] = [];
          var index = 0;
          this.machineItems.forEach(element => {
            label[index] = element.clientName;
            data[index]  = element.parqueMaquinas;
            index++;
          });
          this.createBarChartBrandsByYear(label,data,prevClickValue,typeMachine,0);
        });
    }else{
      this.machineBrandService
      .findOwnersByYear(
        typeMachine.trim(),
        this.getRegioes(),
        prevClickValue.trim(),
        anoModelo.trim(),
        "marca",
        null
        ).subscribe(
          response=>{
          this.machineItems = response;
          var label: String[] = [];
          var data: number[] = [];
          var index = 0;
          this.machineItems.forEach(element => {
            label[index] = element.clientName;
            data[index]  = element.parqueMaquinas;
            index++;
          });
          this.createBarChartBrandsByYear(label,data,prevClickValue,typeMachine,0);
        });
   }
 } 

 findOwnerbyYearMachine(anoModelo,typeMachine,especificacao,brandName){
    this.lastbrandName="";
    console.log(anoModelo,typeMachine,especificacao,brandName)
    if(typeMachine.trim()=='Trator'){
      this.machineBrandService
      .findOwnersByYearCvRange(
        typeMachine.trim(),
        this.getRegioes(),
        especificacao.trim(),
        anoModelo.trim(),
        "proprietario",
        brandName
        ).subscribe(
          response=>{
           
          this.machineItems = response;
          var label: String[] = [];
          var data: number[] = [];
          var index = 0;
          this.machineItems.forEach(element => {
            label[index] = element.clientName;
            data[index]  = element.parqueMaquinas;
            index++;
          });
          this.createBarChartDetailOwner(label,data,typeMachine);
        });
    }else{
      this.machineBrandService
      .findOwnersByYear(
        typeMachine.trim(),
        this.getRegioes(),
        especificacao.trim(),
        anoModelo.trim(),
        "proprietario",
        brandName
        ).subscribe(
          response=>{
            console.log(response)
          this.machineItems = response;
          var label: String[] = [];
          var data: number[] = [];
          var index = 0;
          this.machineItems.forEach(element => {
            label[index] = element.clientName;
            data[index]  = element.parqueMaquinas;
            index++;
          });
          this.createBarChartDetailOwner(label,data,typeMachine);
        });
   }
 } 

 findOwnersByFilters(brandName){
    var anoModelo = localStorage.getItem('anoModelo');
    var typeMachine = localStorage.getItem('typeMachine');
    var especificacao = localStorage.getItem('especificacao');
    this.findOwnerbyYearMachine(anoModelo,typeMachine,especificacao,brandName)

 } 

findChildByValue(brandName,typeMachine){
   this.lastbrandName=brandName;
   this.lastTypeMachine=typeMachine;
   this.machineBrandService.findBrandByName(brandName)
    .subscribe(item=>{
      this.machineBrandId= item['id'];
      this.machineChartService.findByFilters(
      this.machineBrandId,
        0,
        typeMachine
        ,
        this.getRegioes(),
        0,
        '',
        this.formGroup.value.anoMaquinaValue,
        "proprietario",
        'DESC',
        55
      ).subscribe(response=>{
        this.machineItems = response;
        var label: String[] = [];
        var data: number[] = [];
        var index = 0;
        this.machineItems.forEach(element => {
          label[index] = element.clientName;
          data[index]  = element.parqueMaquinas;
          index++;
        });
        this.createBarChartDetailOwner(label,data,typeMachine);
      },
     error =>{console.log(error)}
    );
  });
 } 
 
 ionViewDidLoad() {
    this.loadAgrosulLocation(localStorage.getItem('userId'));  
    this.loadAnoModelo();
  }

  ion
  loadSeedType(){
    this.areaChartService.listAllSeedType()
    .subscribe(
      response=>{
        this.agSeeds = response
      },
      error=>{console.log(error)}
    );
  }

  loadAgrosulLocation(userID){
    if(localStorage.getItem('role') =='admin'){
      var todos = new AgrosulLocationDTO();
      todos.id='0';
      todos.locationName='Todos';
      this.agLocation.push(todos);
      
      todos = new AgrosulLocationDTO();
      todos.id='901';
      todos.locationName='Agrosul 1 - BA/TO';
      this.agLocation.push(todos);

      todos = new AgrosulLocationDTO();
      todos.id='902';
      todos.locationName='Agrosul 2 - PI';
      this.agLocation.push(todos);
    }
		this.agrosulLocationService.findAllByUserId(userID)
		  	.subscribe(response=>{
           // this.agLocation = response
            response.forEach(iten=>{ 
              todos = new AgrosulLocationDTO();
              todos.id=iten.id;
              todos.locationName=iten.locationName;
              this.agLocation.push(todos);
            });
            if(this.agLocation!=undefined || this.agLocation!=null){
              this.isenabled = true;
              this.formGroup.controls.agLocationValue.setValue(this.agLocation[0].id)
            }
              
		},
		error=>{
				console.log(error);
		});	
	}
  
  

	loadClients(){
		this.clientService.findAllNames()
			.subscribe(response=>{
						this.agClients = response
		},
		error=>{
				console.log(error);
		});	
  }

  detailClient(client:ClientDTO){
    var cli : ClientDTO[] =[client];
    var data = { selectedClient : cli };
    var modalPage = this.modalCtrl.create('ClientPage',data);
    modalPage.present();
  }
  
  loadDetail(){
     this.clientService.findAllFarmsByAgLocation(this.formGroup.value.agLocationValue,
            0)
			.subscribe(response=>{
        
        this.formGroup2.controls.clientsValue.setValue(response);
        this.clientList = response;
        this.formGroup2.controls.typeClientValue.setValue(response[0].typeClient.typeName);
        this.formGroup2.controls.clientPhoneNumber.setValue(response[0].farms[0].phoneNumber);
        this.formGroup2.controls.farmsDetailName.setValue(response[0].farms[0].farmName);
        this.formGroup2.controls.agAgrosulLocation.setValue(response[0].farms[0].agrosulLocation.locationName);
        this.formGroup2.controls.farmAreaType.setValue(response[0].farms[0].farmFields[0].farmFielType.typeName);
        this.formGroup2.controls.farmAreaType.setValue(response[0].farms[0].farmFields[0].farmFielType.typeName);
   	},
		error=>{
				console.log(error);
		});	
  }

  loadAnoModelo(){
		this.machineModelService.findAllAnoModelo()
			.subscribe(response=>{
						this.listAno = response
		},
		error=>{
				console.log(error);
		});	
	}


  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    //this.clientList = this.formGroup2.value.clientsValue;
    const temp = this.clientList.filter(function(d) {
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

  getBackgroundColors(labels){
		var backgroudColors:String[]=[];
		var i=0;
		labels.forEach(key=>{
			var cor = this.color.chartColor.get(key);
			if(cor==undefined)
			     cor = ColorChartUtils.getRandomColor();
			backgroudColors[i] = cor;
			i++;
		});
	 return backgroudColors;
  }

  getRegioes(){
    var regioes=[0];
    if( this.formGroup.value.agLocationValue=='901'){
      regioes=[2,3,4,5,6,7,8,9,10,11,12,13,14];
    }else if(this.formGroup.value.agLocationValue=='902'){
      regioes=[15,16,17];
    }else{
      regioes = this.formGroup.value.agLocationValue
    }
    return regioes;
  }

  getDetailByMachineType(clickValue){
    
     if(clickValue.trim() == 'Trator')
      return ' CV '
     else if(clickValue.trim() == 'Plantadeira')
         return 'Linhas'
     else if(clickValue.trim() == 'Colheitadeira')
          return ' Pés '
     else if(clickValue.trim() == 'Pulverizador')
       return ' Metros '
     else if(clickValue.trim() == 'Cotton')
       return ' Tipo '
   }

  onChange(ev: any) {
    
    this.formGroup.controls.lower.setValue(ev._valA);
    this.formGroup.controls.upper.setValue(ev._valB);
  }

  getValueFromLocation(locationName){
    this.formGroup.controls.agLocationName.setValue(locationName);
  }

}
