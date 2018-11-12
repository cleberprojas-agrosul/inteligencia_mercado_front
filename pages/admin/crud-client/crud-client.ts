import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ClientDTO } from '../../../models/clientDTO';
import { WorkMachineDTO } from '../../../models/workMachineDTO';
import { FarmsDTO } from '../../../models/farmsDTO';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { ClientService } from '../../../services/domain/client.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import { WorkMachineService } from '../../../services/domain/workMachine.service';

@IonicPage()
@Component({
  selector: 'page-crud-client',
  templateUrl: 'crud-client.html',
})
export class CrudClientPage {

  formGroup: FormGroup;

  searchMarca:String;
  agClients: ClientDTO[] = [];
  workMachines: WorkMachineDTO[] =[];
  agClient:ClientDTO;
  agFarms:FarmsDTO [] = [];
  detailFarmDTO:FarmsDTO;
  workMachine:WorkMachineDTO;

  constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     public viewCtrl : ViewController,
     public clientService: ClientService,
     public workMachineService: WorkMachineService,
     public formBuiler:FormBuilder) {
      this.formGroup = formBuiler.group({
        clientsValue:[]=[''],
        tipoCliente:[]=[''],
        farms:[]=[],
        farmsDetail:[]=[0],
        farmsDetailName:[] = [],
        farmsLocation:[] = [],
        
        clientPhoneNumber:[] = [],
        clientObs:[] = [],

        agAgrosulLocation:[] = [],

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

        workMachines:[] =[],
        machineModel:[] = [],
        machineBrand:[] = [],
        machineQtd:[] = [],

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
  }

  ionViewDidLoad() {
    this.agClients = this.navParams.get('selectedClient');
    this.agFarms   = this.agClients[0].farms;
    //this.populateForm(this.agClients[0])
  }
  showValue(client){
    alert(client.name);
  }

  irEditar(machine){
    this.workMachineService.findById(machine.id)
    .subscribe(response=>{
      this.workMachine=response;
      this.navCtrl.push("WorkMachinePage",{machine:this.workMachine})
    });
    
  }
  
  updateFilter(event,index) {
    const val = event.target.value.toLowerCase();
    const temp = this.agClients[0].farms[index].workMachines.filter(function(d) {
      return d.machineModel.machineBrand.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.agFarms[index].workMachines=temp;
   // this.rows = temp;
  }

  loadClients(){
   this.clientService.findAllNames()
    .subscribe(response=>{
      this.agClients = response;      
    },
    error=>{console.log(error)})
  }

  clientChange(event: {
    component: IonicSelectableComponent,
    value: any,
  }) {  
    this.clientService.findAllFarmsByClientId(event.value.id).
    subscribe(
      response=> {
        this.agFarms = response,
        console.log(this.agFarms)
      }
    )        
  }

  detailFarm(event: {
      component: IonicSelectableComponent,
      value: any,
    }) { 
      if(event.value!=null){
        console.log(event.value)
        this.formGroup.controls.farmsLocation.setValue(event.value.farmLocation.locationName),
        this.formGroup.controls.clientPhoneNumber.setValue(event.value.phoneNumber),
        this.formGroup.controls.clientObs.setValue(event.value.generalObs),
        this.formGroup.controls.agAgrosulLocation.setValue(event.value.agrosulLocation.locationName),
        this.formGroup.controls.farmFields.setValue(event.value.farmFields),
        this.formGroup.value.farmFields.forEach(element => {
          this.formGroup.controls.farmsFieldName.setValue(element.farmFielType.typeName),
          this.formGroup.controls.farmsFieldTotalArea.setValue(element.farmFielType.totalAreaType)
          
        });
        this.formGroup.controls.farmAreas.setValue(event.value.farmAreas),
        this.formGroup.value.farmAreas.forEach(element => {
          this.formGroup.controls.farmAreaType.setValue(element.farmAreaType.typeName),
          this.formGroup.controls.farmAreaType.setValue(element.totalArea)
        });

        this.formGroup.controls.farmCultivAreas.setValue(event.value.farmCultivAreas),
        console.log(event.value.farmCultivAreas);
        this.formGroup.value.farmCultivAreas.forEach(element => {
          this.formGroup.controls.farmSeed.setValue(element.farmSeed.seedName),
          this.formGroup.controls.farmTotalAreaSeed.setValue(element.totalAreaSeed)
        });

        this.formGroup.controls.workMachines.setValue(event.value.workMachines),
        console.log(event.value.workMachines),
        this.formGroup.value.workMachines.forEach(element => {
          this.formGroup.controls.typeMachine.setValue(element.typeMachine.typeName),
          this.formGroup.controls.machineBrand.setValue(element.machineModel.machineBrand.name),
          this.formGroup.controls.machineModel.setValue(element.machineModel.name)
        });
      }
  } 

  populateForm(client:ClientDTO){
    this.formGroup.controls.farms.setValue(client.farms);
    
   
  }
  public closeModal(){
      this.viewCtrl.dismiss();
  }
  
  onInput($event){
    console.log($event)
  }  

  editFarm(farm:FarmsDTO){
    var toEdit : FarmsDTO[] =[farm];
    var data = { selectedFarm :toEdit };
    this.navCtrl.push("CrudFarmPage",data);
    
  }

}
