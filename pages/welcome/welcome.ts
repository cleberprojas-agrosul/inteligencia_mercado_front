import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import { AreaChartService } from '../../services/domain/area-chart.service';
import { Chart } from 'chart.js';
import { ColorChartUtils } from '../../Utils/color-charts-utils';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MachineChartsPage } from '../machine-charts/machine-charts';
import { AreaChartsPage } from '../area-charts/area-charts';
import { ClientTablePage } from '../client-table/client-table';
import { AreaChartsDetailPage } from '../area-charts-detail/area-charts-detail';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  @ViewChild('pieCanvas') pieCanvas;
  @ViewChild('myTabs') tabRef: Tabs;

  pieChart : Chart;

  formGroup: FormGroup;
  
  labels:String[]=[];
  data:number[]=[];
  soma = 0;
  
  tab1Root = AreaChartsPage;
  tab2Root = AreaChartsDetailPage;
  tab3Root = ClientTablePage;
  tab2Params = { userID:''  }
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public areaService:AreaChartService,
    public formBuiler:FormBuilder) {
      this.formGroup = formBuiler.group({
				somaArea:[]=[0]
      });
  }

  ionViewDidLoad() {
    var id = localStorage.getItem('userId');
    if(id ==null || id == undefined)
     this.navCtrl.setRoot("HomePage");
    
  }

  loadAreaData(){
    this.areaService.getTotalAreaByState().subscribe(response=>{
     var i=0;
     response.forEach(element => {
         this.labels[i]=element['estado'];
         this.data[i] =  Math.round( Number(element['total']));
         this.soma+= Math.round( Number(element['total']));
         i++
     });  
     this.createPieChart(this.labels,this.data);   
     this.formGroup.controls.somaArea.setValue(this.formatarNumero(this.soma));
   });
  }

  createPieChart(labels:String[], data:number[]){
    var labelColors:String[] =[];
    var i=0;
    labels.forEach(item=>{ 
     labelColors[i] = ColorChartUtils.getRandomColor();
     i++;
    });
   if(this.pieChart == null){
       this.pieChart = new Chart(this.pieCanvas.nativeElement, {
         type: 'pie',
         data: {
           labels: labels,
           datasets: [{
             label: '',
             data: data,
             backgroundColor:labelColors
           }]
         },options:{
           'onClick': (c,i)=> {
             console.log(c,i);
             var e = i[0] ;
             //if(i[0]!=null)
               //this.findByValue(i[0]._chart.config.data.labels[e._index]);
         },
     }
   });
   }else{
       this.pieChart.data.labels=labels;
       this.pieChart.data.backgroundColor=labelColors;
       this.pieChart.data.datasets.forEach((dataset) => {
              dataset.data=data;
              dataset.backgroundColor=labelColors;
       });
       this.pieChart.update();
     }	
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

}
