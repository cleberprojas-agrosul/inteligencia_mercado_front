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




@IonicPage()
@Component({
  selector: 'page-area-charts-detail',
  templateUrl: 'area-charts-detail.html',
})
export class AreaChartsDetailPage {

  @ViewChild(Content) content: Content;
  
  @ViewChild('barCanvas') barCanvas;
	@ViewChild('pieCanvas') pieCanvas;

  @ViewChild('pieCanvasCompared') pieCanvasCompared;
  @ViewChild('pieCanvasArea') pieCanvasArea;

  @ViewChild('pieCanvasLocation') pieCanvasLocation;
  

  @ViewChild('barCanvasCompared') barCanvasCompared;
  @ViewChild('barCanvasDetail') barCanvasDetail;
  @ViewChild('barCanvasDetailOwner') barCanvasDetailOwner;
  @ViewChild('filtersSel') filtersSel;

  
  
  formGroup: FormGroup;

  formGroup2: FormGroup;

  pieChart: Chart;
	barChart: Chart;
	
  pieChartCompared: Chart;
  pieChartArea: Chart;
  pieChartLocation: Chart;
  
  barChartCompared: Chart;
  barChartDetail: Chart;
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
  clientName:string=""
  porteCliente:string="";


  constructor(
     public modalCtrl : ModalController,
     public navCtrl: NavController,
     public navParams: NavParams,
     public agrosulLocationService: AgrosulLocationService,
     public machineChartService :  MachineChartService,
     public machineBrandService: MachineBrandService,
     public areaChartService: AreaChartService,
     public clientService: ClientService,
     public formBuiler:FormBuilder) {
      this.color = new ColorChartUtils()
      this.formGroup = formBuiler.group({
				farmAreaType:[] =[],
        agLocationValue:[]=[0],
        agLocationName:[]=[""],
				clientValue:[]=[],
				farmArea:[]=[],
				compareData:[] = [],
        chartTypeX:"seedRanking",
        chartTypeY:String,
        lineLimit:[]=[9999],
        seedType:[]=[0],
        clientSize:[]=[0],
        areaSize:[]=[0],

        sumClientSoja:[]=[0],
        sumClientMilho:[]=[0],
        sumClientAlgodao:[]=[0],
        sumClientFeijao:[]=[0],

        sum:[]=[0],
        sumByLocation:[]=[0],
        sumSoja:[]=[0],
        sumMilho:[]=[0],
        sumAlgodao:[]=[0],
        sumPecuaria:[]=[0],
        sumFeijao:[]=[0],
        sumCafe:[]=[0],
        sumHorti:[]=[0],
        sumOutros:[]=[0],

        sumSojaLocal:[]=[0],
        sumMilhoLocal:[]=[0],
        sumAlgodaoLocal:[]=[0],
        sumPecuariaLocal:[]=[0],
        sumFeijaoLocal:[]=[0],
        sumCafeLocal:[]=[0],
        sumHortiLocal:[]=[0],
        sumOutrosLocal:[]=[0],

        sumGpPp:[]=[0],
        sumClassTamArea:[]=[0],

        sumMaquinas:[]=[0],
        AllBrands:[]=[""],
        clientName:" ",
        lastbrandName:"",
        lastTypeMachine:"",
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
      //local= {id:string='';l};
      //this.agLocation.push() 
  }

  submitForm(event): void {
    var fields:String[] = [];
    if(this.formGroup.value.chartTypeX == "getTotalAreaByType"){
      fields = ['areaPropria','areaArrendada']
      this.createMultiLevelBartChart(fields)
    }else {
         fields = ['Soja','Milho','Algodao','Pecuaria','Feijao','Outros','Cafe','Horti'];
      this.createMultiLevelBartChart(fields);
      this.setDataPieChartAreaTotal(fields)
    }
    this.addNew();
}

createMultiLevelBartChart(fields){
  var filter:AreaFilterDTO = new AreaFilterDTO();
    filter.agLocationId = this.formGroup.value.agLocationValue==null?0:this.formGroup.value.agLocationValue,
    filter.clientValue  = this.formGroup.value.clientValue,
    filter.farmArea  = this.formGroup.value.farmArea,
    filter.chartTypeX = this.formGroup.value.chartTypeX,
    this.areaChartService.listAllSeedTypeByLocation(fields,filter)
    .subscribe(response=>{
      this.items = response;
      var label: String[] = [];
      var data: any[] = [];
      var index = 0;
      var sum = 0;
			let map = new Map<String,number[]>();
      this.items.forEach(element => {
          label[index] = element.locationName;
          var j = 0;
         	element.seeds.forEach( seed=> {
              var r:number[]=[];
             	if(	map.get(seed.seedName)!=null &&
									map.get(seed.seedName).length !=null &&
									map.get(seed.seedName).length >0 ){
             				r =	map.get(seed.seedName)
										map.delete(seed.seedName);
										var pos = r.length;
                    r[pos] =  Math.round(seed.total);
                 	}else{
										r[j] = Math.round(seed.total);
                  }
                  sum = sum+Math.round(seed.total);
									map.set(seed.seedName,r);
					});
					j++;
					index++;
       });
       var pieData:number[]=[]
       var pieLabels:String[]=[];
       this.formGroup.controls.sum.setValue(this.formatarNumero(sum));
       var i = 0;
       map.forEach( (items,key)=>{
        pieData[i] = items[0];
        pieLabels[i]=key;   
        data[i] = {
					label: key,
					data:items,
					backgroundColor:this.color.chartColor.get(key),
					borderWidth: 0          
        };
        this.setCultivTotal(items[0],key);
				i++
      });
      if(this.formGroup.value.chartTypeX == "seedRanking"){
          this.createPieChart(pieLabels,pieData)
      }else
         	 this.createBarChart(label,data);
    });
}

setDataPieChartAreaTotal(fields){
  var filter:AreaFilterDTO = new AreaFilterDTO();
    filter.agLocationId = 0,
    filter.clientValue  = null,
    filter.farmArea  = this.formGroup.value.farmArea,
    filter.chartTypeX = "seedRanking",
    this.areaChartService.listAllSeedTypeByLocation(fields,filter)
    .subscribe(response=>{
      this.items = response;
      var label: String[] = [];
      var data: any[] = [];
      var index = 0;
      var sum = 0;
			let map = new Map<String,number[]>();
      this.items.forEach(element => {
          label[index] = element.locationName;
          var j = 0;
         	element.seeds.forEach( seed=> {
              var r:number[]=[];
             	if(	map.get(seed.seedName)!=null &&
									map.get(seed.seedName).length !=null &&
									map.get(seed.seedName).length >0 ){
             				r =	map.get(seed.seedName)
										map.delete(seed.seedName);
										var pos = r.length;
                    r[pos] =  Math.round(seed.total);
                 	}else{
										r[j] = Math.round(seed.total);
                  }
                  sum = sum+Math.round(seed.total);
									map.set(seed.seedName,r);
					});
					j++;
					index++;
       });
       var pieData:number[]=[]
       var pieLabels:String[]=[];
       this.formGroup.controls.sumByLocation.setValue(this.formatarNumero(sum));
       var i = 0;
       map.forEach( (items,key)=>{
        pieData[i] = items[0];
        pieLabels[i]=key;   
        this.setCultivTotalByLocation(items[0],key);
				i++
      });
       this.createPieChartAreaTotal(pieLabels,pieData)
      
    });
}

setCultivTotalByLocation(total:number,key:String){
  if(key=='Soja')
     this.formGroup.controls.sumSojaLocal.setValue(this.formatarNumero(total));
  else   if(key=='Milho')
     this.formGroup.controls.sumMilhoLocal.setValue(this.formatarNumero(total));
  else   if(key=='Algodao')
     this.formGroup.controls.sumAlgodaoLocal.setValue(this.formatarNumero(total));
  else   if(key=='Feijao')
     this.formGroup.controls.sumFeijaoLocal.setValue(this.formatarNumero(total));
  else   if(key=='Pecuaria')
     this.formGroup.controls.sumPecuariaLocal.setValue(this.formatarNumero(total));
  else   if(key=='Outros')
     this.formGroup.controls.sumOutrosLocal.setValue(this.formatarNumero(total));
  else   if(key=='Cafe')
     this.formGroup.controls.sumCafeLocal.setValue(this.formatarNumero(total));
  else   
     this.formGroup.controls.sumHortiLocal.setValue(this.formatarNumero(total));

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

createPieChartAreaTotal(labels,data1){
	if(this.pieChartLocation == null){
      this.pieChartLocation = new Chart(this.pieCanvasLocation.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: '',
          data: data1,
          backgroundColor:this.getBackgroundColors(labels)
        }]
      },options:{
        responsive: true,
        maintainAspectRatio: true,
        title: {
          display: true,
          text: 'Tipo de Cultura (Todas as Regiões)'
        },
        legend: {
          display: true,
          position:'left'
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
                    //mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
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
                // ctx.fillText(dataset.data[i], model.x + x, model.y + y);
                // Display percent in another line, line break doesn't work for fillText
               
              }
            });               
          }
        },
        events: ['click'],
        hover: {animationDuration: 0}   
      }	
    });
  }else{
    this.pieChartLocation.data.labels=labels;
    this.pieChartLocation.data.backgroundColor=this.getBackgroundColors(labels);
    this.pieChartLocation.data.datasets.forEach((dataset) => {
             dataset.data=data1;
             dataset.backgroundColor=this.getBackgroundColors(labels);
     });
    this.pieChartLocation.update();
    
  }
  return this.pieChartLocation;
}

createPieChart(labels,data1){
	if(this.barChart == null){
      this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: '',
          data: data1,
          backgroundColor:this.getBackgroundColors(labels)
        }]
      },options:{
        responsive: true,
        maintainAspectRatio: true,
        legend: {
          display: true,
          position:'right'
        },
        title: {
          display: true,
          text: 'Tipo de Cultura da Região - '+this.formGroup.value.agLocationName
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
                    //mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
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
                // ctx.fillText(dataset.data[i], model.x + x, model.y + y);
                // Display percent in another line, line break doesn't work for fillText
               
              }
            });               
          }
        },
        events: ['click'],
        hover: {animationDuration: 0}   
      }	
    });
  }else{
    this.barChart.data.labels=labels;
    this.barChart.data.backgroundColor=this.getBackgroundColors(labels);
    this.barChart.options.title.text='Tipo de Cultura da Região - '+this.formGroup.value.agLocationName
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
        responsive: true,
        maintainAspectRatio: true,
        legend: {
          display: true
        },
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
    this.barChart.type='bar';
    this.barChart.update();
  }
  return this.barChart;
}


addNew():void{
  this.isenabled=true;
  this.areaChartService.getAreasByFilters(
		this.formGroup.value.agLocationValue,
		null
		).subscribe(response=>{
      response;
 			var label: String[] = [];
      var data: number[] = [];
      var i=0;
      response.forEach(item=>{
        label[i]= item['area'];
        data[i]=item['quantidade'];
        i++;
      })
		
   		this.createPieChartCompared(label,data,this.formGroup.value.agLocationName);
		},
		error =>{console.log(error)}
	);	 	     
 }

 createPieChartCompared(labels:String[], data:number[],locationName:String){
var sumTotal=0
  data.forEach(iten => {
    sumTotal+= iten;
  });
  this.formGroup.controls.sumGpPp.setValue(sumTotal);
  if(this.pieChartCompared == null){
      this.pieChartCompared = new Chart(this.pieCanvasCompared.nativeElement, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            label: 'Nº Maquinas',
            data: data,
            backgroundColor:this.getBackgroundColors(labels)
          }]
        },options:{
          legend: {
            display: true,
            position:'left'
          },
          title: {
            display: true,  
            text: 'Classificação p/ Tipo de Cultura - '+locationName
          },
          'onClick': (c,i)=> {
            var e = i[0] ;
            if(i[0]!=null){
              this.porteCliente=i[0]._chart.config.data.labels[e._index];
              this.findByValue(this.porteCliente);
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
            var sumTotal=0;
            ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            console.log(this.data)
            this.data.datasets.forEach(function (dataset) {
              for (var i = 0; i < dataset.data.length; i++) {
                var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                    total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                    //mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
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
                // ctx.fillText(dataset.data[i], model.x + x, model.y + y);
                // Display percent in another line, line break doesn't work for fillText
              }
            });
          }
        },
        events: ['click'],
        hover: {animationDuration: 0}  
    }
  });
  }else{
      this.pieChartCompared.data.labels=labels;
      this.pieChartCompared.data.backgroundColor=this.getBackgroundColors(labels);
      this.pieChartCompared.options.title.text='Classificação p/ Tipo de Cultura - '+locationName;
      this.pieChartCompared.data.datasets.forEach((dataset) => {
             dataset.data=data;
             dataset.backgroundColor=this.getBackgroundColors(labels);
      });
      this.pieChartCompared.update();
    }	
  }

  createPieChartTamanhoArea(labels:String[], data:number[]){
    var sumTotal=0
    data.forEach(iten => {
      sumTotal+= iten;
    });
    this.formGroup.controls.sumClassTamArea.setValue(sumTotal);

    if(this.pieChartArea == null){
        this.pieChartArea = new Chart(this.pieCanvasArea.nativeElement, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              label: 'Classificação p/ Tam. Área',
              data: data,
              backgroundColor:this.getBackgroundColors(labels)
            }]
          },options:{
            title: {
              display: true,
              text: 'Classificação p/ Tam. Área - '+this.formGroup.value.agLocationName
            },
            'onClick': (c,i)=> {
              var e = i[0] ;
              var label:string[]=[];
              var data:number[]=[];
              var index=0;
              if(i[0]!=null){
                var tamanhoArea=i[0]._chart.config.data.labels[e._index];
                this.areaChartService.getProprietariosByTamanhoAreaCultura(
                  this.formGroup.value.agLocationValue,
                  this.porteCliente,
                  tamanhoArea
                  ).subscribe(response=>{
                      response.forEach(element => {
                      var somaAreaCultivada = element['totalSoja']+element['totalMilho']+element['totalAlgodao']+element['totalFeijao'];
                      label[index] = element['proprietario'];
                      data[index]  = somaAreaCultivada ==0?1:somaAreaCultivada;
                      index++;
                    });
                    this.createBarChartDetailOwner(label,data,this.porteCliente+' - '+tamanhoArea + ' - Total Clientes:'+data.length);
                  })
               
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
                      //mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
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
                  // ctx.fillText(dataset.data[i], model.x + x, model.y + y);
                  // Display percent in another line, line break doesn't work for fillText
                 
                }
              });               
            }
          },
          events: ['click'],
          hover: {animationDuration: 0}  
      }
    });
    }else{
        this.pieChartArea.data.labels=labels;
        this.pieChartArea.data.backgroundColor=this.getBackgroundColors(labels);
        this.pieChartArea.options.title.text='Classificação p/ Tam. Área - '+this.formGroup.value.agLocationName
        this.pieChartArea.data.datasets.forEach((dataset) => {
               dataset.data=data;
               dataset.backgroundColor=this.getBackgroundColors(labels);
        });
        this.pieChartArea.update();
      }	
    }

 findMachinesByBrand(typeMachine){
  var test=0;
  this.machineChartService.findByFilters(
       0,
       0,
       typeMachine
       ,
       this.formGroup.value.agLocationValue,
       0,
       '',
       "",
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
       this.createBarChartDetail(label,data,typeMachine);
     },
    error =>{console.log(error)}
   );
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
          'onClick': (c,i)=> {
            if(i[0]!=null){
              var e = i[0] ;
              var machineType = i[0]._chart.config.data.labels[e._index];
              var brandName = i[0]._model.datasetLabel;
              this.findMachinesByBrand(machineType)
             // this.findChildByValue(brandName,machineType);
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
              text: 'Clientes p/ Tipo de Cultura e Tamanho de Área - '+this.formGroup.value.agLocationName
            },           
          'onClick': (c,i)=> {
            if(i[0]!=null){
              var e = i[0] ;
              var totalCultivo = i[0]._chart.config.data.datasets[0].data[e._index];
              this.clientName = i[0]._chart.config.data.labels[e._index];
              this.formGroup.controls.sumClientSoja.setValue(this.formatarNumero(totalCultivo) +'- Ha Cultivados');
              this.formGroup.controls.clientName.setValue(this.clientName);
              this.formGroup.controls.lastbrandName.setValue(clickValue);
              this.formGroup.controls.lastTypeMachine.setValue(this.lastTypeMachine);
              this.machineBrandService
              .findMachineByBrandAndOwner(
                  this.clientName,
                  "",
                  "",
                  this.formGroup.value.agLocationValue
                  ).
                  subscribe(response=>{
                      var detail="";
                      var temp:MachineModelChartDTO[]=[];
                      this.rows = response;
                      var i=0;
                      this.rows.forEach(item=>{
                        detail="";
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
                      })
                      this.rows=temp;
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
     this.barChartDetailOwner.options.title.text= 'Clientes p/ Tipo de Cultura e Tamanho de Área - '+this.formGroup.value.agLocationName
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
 
 createBarChartDetail(labels:String[], data:number[],clickValue:string){
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
            'onClick': (c,i)=> {
              if(i[0]!=null){
                var e = i[0] ;
                var brandName = i[0]._chart.config.data.labels[e._index];
                var machineType = i[0]._model.datasetLabel;
                //console.log(machineType,brandName);
                //this.findMachinesByBrand(machineType)
                this.findChildByValue(brandName,machineType);
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
       this.barChartDetail.data.labels=labels;
       this.barChartDetail.data.backgroundColor=labelColors;
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

 findByValue(porteCliente){
   this.areaChartService.getAreasByFilters(
     this.formGroup.value.agLocationValue,
     porteCliente
   ).subscribe(item=>{
        var label: String[] = [];
        var data: number[] = [];
        var i=0;
        item.forEach(item=>{
          label[i]= item['area'];
          data[i]=item['quantidade'];
          i++;
        })
        this.createPieChartTamanhoArea(label,data)
    });
 } 

findChildByValue(brandName,typeMachine){
  var test=0;
  //console.log(brandName,typeMachine)
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
        this.formGroup.value.agLocationValue,
        0,
        '',
        "",
        "proprietario",
        'DESC',
        55
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

        this.createBarChartDetailOwner(label,data,typeMachine);
   
      },
     error =>{console.log(error)}
    );
  });
 } 
 
 ionViewDidLoad() {
    this.loadAgrosulLocation(localStorage.getItem('userId'));  
    this.loadSeedType();
   
  }

  
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

  getValueFromLocation(locationName){
    this.formGroup.controls.agLocationName.setValue(locationName);
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

}