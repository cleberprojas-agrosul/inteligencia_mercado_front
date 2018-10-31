import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { MachineModelChartDTO} from '../../models/charts/machineModelChartDTO';
import { MachineChartService } from '../../services/domain/machine-chart.service';
import { MachineBrandService} from '../../services/domain/machineBrand.service';
import {MachineTypeService }	from '../../services/domain/machineType.service';
import { MachineBrandDTO } from '../../models/machineBrandDTO';
import { MachineTypeDTO } from '../../models/machineTypeDTO';
import { AgrosulLocationService } from '../../services/domain/agrosulLocation.service';
import { AgrosulLocationDTO } from '../../models/agrosulLocationDTO';
import { ClientService } from '../../services/domain/client.service';
import { ClientDTO } from '../../models/clientDTO';
import { MachineModelService } from '../../services/domain/machineModel.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ColorChartUtils } from '../../Utils/color-charts-utils';

@IonicPage()
@Component({
  selector: 'page-machine-charts',
  templateUrl: 'machine-charts.html',
})
export class MachineChartsPage {
  
	@ViewChild('barCanvas') barCanvas;
	@ViewChild('pieCanvas') pieCanvas;

	@ViewChild('pieCanvasCompared') pieCanvasCompared;
	@ViewChild('barCanvasCompared') barCanvasCompared;
	@ViewChild('filtersSel') filtersSel;
	


	doughnutChart: Chart;
	pieChart: Chart;
	barChart: Chart;
	
	pieChartCompared: Chart;
	barChartCompared: Chart;
	
	formGroup: FormGroup;
	formGroup2: FormGroup;
	
	items : MachineModelChartDTO[] = [];
	filterNames : String = "";
	brands: MachineBrandDTO[] = [];
	types: MachineTypeDTO[] = [];
	agLocation: AgrosulLocationDTO[] = [];
	agClients: ClientDTO[] = [];
	concessionarias: String[] = [];
	listAno: String[] = [];
	clientList: ClientDTO[] = [];

	color:ColorChartUtils ;

	isenabled=false;

  constructor(
	  public navCtrl: NavController,
	  public navParams: NavParams,
		public machineChartService :  MachineChartService,
		public machineBrandService : MachineBrandService,
		public machineTypeService  : MachineTypeService,
		public agrosulLocationService: AgrosulLocationService,
		public clientService: ClientService,
		public machineModelService:MachineModelService,
		public loadingCtrl: LoadingController,
		public formBuiler:FormBuilder
	  ) {
			this.formGroup = formBuiler.group({
				brandValue:[] =[0],
				typeMachineValue:[]=[0],
				agLocationValue:[]=[0],
				clientValue:[]=[0],
				concessionariaValue:[]=[""],
				compareData:[] = [],
				chartType:"marca",
				anoMaquinaValue:[]=[""],
				lineLimit:[]=[0],
				orderType:[]=["DESC"],
				usedFilters:[]=[""],
				soma1:[]=[],
				soma2:[]=[]
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


			this.color = new ColorChartUtils();
   }

     
  detailClient(client:ClientDTO){
    var cli : ClientDTO[] =[client];
    var data = { selectedClient : cli };
    this.navCtrl.push('ClientPage',data);
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

   submitForm(event): void {
		this.isenabled=true;
		this.machineChartService.findByFilters(
			this.formGroup.value.brandValue,
			this.formGroup.value.typeMachineValue,
			"",
			this.formGroup.value.agLocationValue,
			this.formGroup.value.clientValue,
			this.formGroup.value.concessionariaValue,
			this.formGroup.value.anoMaquinaValue,
			this.formGroup.value.chartType,
			this.formGroup.value.orderType,
			this.formGroup.value.lineLimit
			).subscribe(response=>{
				this.items = response;
				var label: String[] = [];
				var data: number[] = [];
				var index = 0;
				var soma=0;
				this.items.forEach(element => {
					label[index] = element.clientName;
					data[index]  = element.parqueMaquinas;
					soma += element.parqueMaquinas;
					index++;
		   });
		   this.formGroup.controls.soma1.setValue(this.formatarNumero(soma));
		   this.createPieChart(label,data);
		   this.createBarChart(label,data);
		  
		},
		error =>{console.log(error)}
		);	 	     
   } 

   addNew():void{
	this.machineChartService.findByFilters(
		this.formGroup.value.brandValue,
		this.formGroup.value.typeMachineValue,
		"",
		this.formGroup.value.agLocationValue,
		this.formGroup.value.clientValue,
		this.formGroup.value.concessionariaValue,
		this.formGroup.value.anoMaquinaValue,
		this.formGroup.value.chartType,
		this.formGroup.value.orderType,
		this.formGroup.value.lineLimit
		).subscribe(response=>{
			this.items = response;
			var label: String[] = [];
			var data: number[] = [];
			var index = 0;
			var soma=0;
			this.items.forEach(element => {
				label[index] = element.clientName;
				data[index]  = element.parqueMaquinas;
				index++;
				soma += element.parqueMaquinas;
			});
			this.formGroup.controls.soma2.setValue(this.formatarNumero(soma));
			this.createPieChartCompared(label,data);
			this.createBarChartCompared(label,data);
		
		},
		error =>{console.log(error)}
	);	 	     
   }
	
   loadBrands(){
		this.machineBrandService.findAll()
			.subscribe(response=>{
						this.brands = response;
		},
		error=>{
				console.log(error);
		});	
	}

	loadTypeMachines( ){
		this.machineTypeService.findAll()
			.subscribe(response=>{
						this.types = response;
						
		},
		error=>{
				console.log(error);
		});	
	}

	loadAgrosulLocation(userID){
		this.agrosulLocationService.findAllByUserId(userID)
			.subscribe(response=>{
				this.agLocation = response
		},
		error=>{
				console.log(error);
		});	
	}

	loadClients( ){
		this.clientService.findAllNames()
			.subscribe(response=>{
						this.agClients = response
		},
		error=>{
				console.log(error);
		});	
	}

	loadConcessionarias( ){
		this.machineModelService.findAllConcessionarias()
			.subscribe(response=>{
						this.concessionarias = response
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

    ionViewDidLoad() {
		//this.loadBrands();
		//this.loadTypeMachines();  
		this.loadAgrosulLocation(localStorage.getItem('userId'));  
		//this.loadClients();
		//this.loadConcessionarias();
		//this.loadAnoModelo();
	}

	createBarChart(labels,data){
		if(this.barChart == null){
				this.barChart = new Chart(this.barCanvas.nativeElement, {
				type: 'bar',
				data: {
					labels: labels,
					datasets: [{
						data: data,
						backgroundColor: this.getBackgroundColors(labels)
						
					}]
				},options:{
					"animation": {
						"duration": 0,
						"onComplete": function() {
						var chartInstance = this.chart,
							ctx = chartInstance.ctx;
				
						ctx.font = Chart.helpers.fontString(
							Chart.defaults.global.defaultFontSize,
							Chart.defaults.global.defaultFontStyle,
							Chart.defaults.global.defaultFontFamily);
						ctx.textAlign = 'center';
						ctx.textBaseline = 'bottom';
						this.data.datasets.forEach(function(dataset, i) {
								var meta = chartInstance.controller.getDatasetMeta(i);
								meta.data.forEach(function(bar, index) {
									var data = dataset.data[index];
									ctx.fillText(data, bar._model.x, bar._model.y+5 );
								});
							});
						}
					},
					legend: {
						display: false
					},
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
					tooltips: {
						enabled: false,

					},
					events:{
						onClick:["click"]
					} ,
				hover: {mode: null}
				}				
			});
		}else{
			this.barChart.data.labels=labels;
			this.barChart.data.datasets.forEach((dataset) => {
			 dataset.data=data;
		 });
		 this.barChart.update();
		}
		return this.barChart;
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

	createPieChart(labels:String[], data:number[]){
		var colors = this.getBackgroundColors(labels);
		if(this.pieChart == null){
		    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					label: 'Nº Maquinas por Cliente',
					data: data,
					backgroundColor: colors
				}]
			}
			
		});
	  }else{
		this.pieChart.data.labels=labels;
		this.pieChart.data.datasets.forEach((dataset) => {
		 dataset.data=data;
		 dataset.backgroudColors = colors
		});
		this.pieChart.update();
	 }	
	}
	
	createBarChartCompared(labels,data){
		if(this.barChartCompared == null){
				this.barChartCompared = new Chart(this.barCanvasCompared.nativeElement, {
				type: 'bar',
				data: {
					labels: labels,
					datasets: [{
						label: 'Nº Maquinas por Cliente',
						data: data,
						backgroundColor: this.getBackgroundColors(labels),						
					}]
				},options:{
					"animation": {
						"duration": 0,
						"onComplete": function() {
						var chartInstance = this.chart,
							ctx = chartInstance.ctx;
				
						ctx.font = Chart.helpers.fontString(
							Chart.defaults.global.defaultFontSize,
							Chart.defaults.global.defaultFontStyle,
							Chart.defaults.global.defaultFontFamily);
						ctx.textAlign = 'center';
						ctx.textBaseline = 'bottom';
						this.data.datasets.forEach(function(dataset, i) {																																												
								var meta = chartInstance.controller.getDatasetMeta(i);
								meta.data.forEach(function(bar, index) {
									var data = dataset.data[index];
									ctx.fillText(data, bar._model.x, bar._model.y + 5);
								});
							});
						}
					},																																																			
					legend: {
						display: false
					},
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
					tooltips: {
						enabled: false
					},
					events: ['click'],
					hover: {animationDuration: 0}
				}				
			});
		}else{
			this.barChartCompared.data.labels=labels;
			this.barChartCompared.data.datasets.forEach((dataset) => {
			 dataset.data=data;
			 dataset.backgroudColors=this.getBackgroundColors(labels)
		 });
		 this.barChartCompared.update();
		}
	}

	createPieChartCompared(labels:String[], data:number[]){
		if(this.pieChartCompared == null){
		    this.pieChartCompared = new Chart(this.pieCanvasCompared.nativeElement, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					label: 'Nº Maquinas por Cliente',
					data: data,
					backgroundColor:this.getBackgroundColors(labels)
				}]
			},
			options:{
				legend: {
					display: false
				},
				tooltips: {
					enabled: false
				},
   			hover: {mode: null}
			}
		});
	  }else{
		this.pieChartCompared.data.labels=labels;
		this.pieChartCompared.data.datasets.forEach((dataset) => {
		 dataset.data=data;
		 dataset.backgroudColors=this.getBackgroundColors(labels)
		});
		this.pieChartCompared.update();
	 }	
    }

	presentLoading() {
		let loader = this.loadingCtrl.create({
		  content: "Aguarde..."
		});
		loader.present();
		return loader;
	}

	
	getValueFromBrand(value){
		//this.filterNames = "Filtro por:"+this.formGroup.value.chartType;
		//this.formGroup.controls.usedFilters.setValue(this.filterNames);
	}
	getValueFromType(value){
		//this.filterNames[0].type=value;
	}
	getValueFromClient(value){
		//this.filterNames[0].clientName=value;
	}
	getValueFromLocation(value){
		//this.filterNames[0].location=value;
	}
	getValueFromConcess(value){
		//this.filterNames[0].concess=value;
	}

	/*setBrandValue(event: { component: SelectSearchableComponent, value: any }) {
		console.log('port:', event.value);
	}*/

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
	  
}
