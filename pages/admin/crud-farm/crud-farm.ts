import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FarmsDTO } from '../../../models/farmsDTO';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FarmFieldDTO } from '../../../models/farmFieldDTO';
import { FarmFieldTypeDTO } from '../../../models/farmFieldTypeDTO';
import { FarmCultivAreaDTO } from '../../../models/farmCultivAreaDTO';
import { FarmSeedDTO } from '../../../models/farmSeedDTO';
import { FarmAreaDTO } from '../../../models/farmAreaDTO';
import { FarmAreaTypeDTO } from '../../../models/farmAreaTypeDTO';

/**
 * Generated class for the CrudFarmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crud-farm',
  templateUrl: 'crud-farm.html',
})
export class CrudFarmPage {

  agFarms:FarmsDTO [] = [];
  formGroup: FormGroup;
  listFarmField:FarmFieldDTO[] = [];
  listFarmCultiv:FarmCultivAreaDTO[] = [];
  listFarmAreas:FarmAreaDTO[] = [];
  farmFields:FarmFieldTypeDTO[] = [];
  farmSeeds:FarmSeedDTO[] = [];
  farmAreas:FarmAreaTypeDTO[] = [];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuiler:FormBuilder ) {
                this.formGroup = formBuiler.group({
                
                  farms:[]=[],
                  farmId:[]=[],
                  farmName:[]=[],
                  phoneNumber:[] = [],
                  clientEmail:[] = [],
                  generalObs:[] = [],
                  totalAreaType:[] = [],
                  totalMainCulture:[] = [],
                  percentMainCulture:[] = [],
                  rankBySeedType:[] = [],
                  rankBySizeArea:[] = [],
                  totalArea:[] = [],
                  
                  farmFields:[]=[],
                  farmFieldsToEdit:[]=[],
                  farmFieldsId:[] = [],
                  farmFieldsTotalAreaType:[] = [],
                  ffEditTotalAreaType:[] = [],
                  farmFieldsTypeId:[] = [],
                  farmFieldsTypeName:[] = [],

                  farmCultivAreas:[] = [],
                  farmCATotalAreaSeed:[] = [],
                  farmCAHarvestNum:[] = [],
                  farmSeed:[]=[],
                  farmSeedName:[]=[],

                  agrosulLocation:[] = [],
                  agrosulLocationId:[] = [],
                  locationName:[] = [],

                  farmAreas:[] = [],
                  fATotalArea:[] = [],
                  fATypeName:[] = [],

                  workMachines:[] = [],
                  wmId:[] = [],
                  wmName:[] = [],
                  wmTractorHorsePower:[] = [],
                  wmHarvesterFeet:[] = [],
                  wmMachineQtd:[] = [],
                  wmPlanterLineNumbers:[] = [],
                  wmPlanterBetweenLines:[] = [],
                  wmSolidDistVolume:[] = [],
                  wmMachineName:[] = [],
                  wmMachineYear:[] = [],
                  wmCottonType:[] = [],
                  wmHarvesterHeadType:[] = [],
                  wmSprayerBarLength:[] = [],

                  wmMachineModel:[] = [],
                  wmMachineModelId:[] = [],
                  wmMachineModelName:[] = [],

                  wmMachineBrand:[] = [],
                  wmMachineBrandName:[] = [],
                  wmMachineBrandId:[] = [],
                  
                  wmTypeMachine:[] =[],
                  wmTypeMachineId:[] =[],
                  wmTypeMachineName:[] =[],
                  wmTypeMachineTotal:[] =[],
                  wmTypeMTipoEquipamento:[] =[],
                });
  }

  ionViewDidLoad() {

    this.loadFieldType();
    this.loadSeeds();
    this.agFarms = this.navParams.get('selectedFarm');
    
    this.formGroup.controls.farms.setValue(this.agFarms);
    //single values
    this.formGroup.controls.farmName.setValue(this.agFarms[0].farmName);
    this.formGroup.controls.phoneNumber.setValue(this.agFarms[0].phoneNumber);
    this.formGroup.controls.clientEmail.setValue(this.agFarms[0].clientEmail);
    this.formGroup.controls.generalObs.setValue(this.agFarms[0].generalObs);
    this.formGroup.controls.totalAreaType.setValue(this.agFarms[0].totalAreaType);
    this.formGroup.controls.totalArea.setValue(this.agFarms[0].totalArea);
    
    // agrosul Location
    this.formGroup.controls.agrosulLocationId.setValue(this.agFarms[0].agrosulLocation.id);
    this.formGroup.controls.locationName.setValue(this.agFarms[0].agrosulLocation.locationName);

    //farm fields Sequeiro || Irrigada
    this.formGroup.controls.farmFields.setValue(this.agFarms[0].farmFields);
    this.agFarms[0].farmFields.forEach(field=>{
      this.listFarmField.push(field)
      this.formGroup.controls.farmFieldsId.setValue(field.id);
      this.formGroup.controls.farmFieldsTotalAreaType.setValue(field.totalAreaType);
      this.formGroup.controls.farmFieldsTypeName.setValue(field.farmFielType.typeName);
     // this.formGroup.controls.farmFieldsTypeId.setValue(field.farmFielType.id);
    });

    //farm Cultiv Areas -  Milho,Soja,Algodao etc...
    this.agFarms[0].farmCultivAreas.forEach(fca=>{
      this.listFarmCultiv.push(fca);
      this.farmSeeds.push(fca.farmSeed);
      this.formGroup.controls.farmCATotalAreaSeed.setValue(fca.totalAreaSeed);
      this.formGroup.controls.farmCAHarvestNum.setValue(fca.harvestNum);
      this.formGroup.controls.farmSeed.setValue(fca.farmSeed);
      this.formGroup.controls.farmSeedName.setValue(fca.farmSeed.seedName);
    });

    //Farm Area - Propria || Arrendada
    this.agFarms[0].farmAreas.forEach(area=>{
      this.listFarmAreas.push(area);
      this.farmAreas.push(area.farmAreaType);
      this.formGroup.controls.fATypeName.setValue(area.farmAreaType.typeName);
      this.formGroup.controls.fATotalArea.setValue(area.totalArea);
    });    
    
   // Work Machines - Parque de maquinas
   this.agFarms[0].workMachines.forEach(wm=>{
   });
  }

  updateFarmField(farmField){
      var index = this.listFarmField.indexOf(farmField,0)
      this.listFarmField.splice(index,1)
      farmField.totalAreaType =  this.formGroup.value.farmFieldsTotalAreaType;
      this.listFarmField.push(farmField);
  }

  updateCultivArea(farmCultiv){
      var index = this.listFarmCultiv.indexOf(farmCultiv,0)
      this.listFarmCultiv.splice(index,1)
      farmCultiv.farmCATotalAreaSeed =  this.formGroup.value.farmCATotalAreaSeed;
      this.listFarmCultiv.push(farmCultiv);
      
  }

  updateFarmArea(farmArea){
    var index = this.listFarmAreas.indexOf(farmArea,0)
    this.listFarmAreas.splice(index,1)
    farmArea.farmAreaType =  this.formGroup.value.fATotalArea;
    this.listFarmAreas.push(farmArea);
    
}

  /*updateFarmField(){
    this.formGroup.controls.farmFieldsTotalAreaType.setValue(this.formGroup.value.ffEditTotalAreaType);
    var tpEdot = this.formGroup.value.farmFieldsToEdit
    var res:FarmFieldTypeDTO[] = this.farmFields.filter(function(d){return d.id ==tpEdot })
    this.formGroup.controls.farmFieldsTypeName.setValue(res[0].typeName);
    this.cleanField();
 }*/

 cleanField(){
  this.formGroup.controls.farmFieldsToEdit.setValue(" ");
  this.formGroup.controls.ffEditTotalAreaType.setValue(" ");
 }

 loadFieldType(){
    var fftype = new FarmFieldTypeDTO();
    fftype.id="1"
    fftype.typeName="Sequeiro"
    this.farmFields.push(fftype);
    
    fftype = new FarmFieldTypeDTO();
    fftype.id="2"
    fftype.typeName="Irrigada"
    this.farmFields.push(fftype);
 }

 loadSeeds(){
  /*TODO 
    chamar servico para carregar tipos de cultura - algoda, soja, milho etc
   */
 }
  
 saveData(){
   console.log(this.listFarmField)  
   console.log(this.formGroup.value.farmFieldsTotalAreaType)
 }

 onfarmFielTypeChange(farmFielType,ffield){
  
  console.log(farmFielType)
 }
 
}
