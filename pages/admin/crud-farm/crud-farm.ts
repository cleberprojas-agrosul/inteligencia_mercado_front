import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FarmsDTO } from '../../../models/farmsDTO';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FarmFieldDTO } from '../../../models/farmFieldDTO';
import { FarmFieldTypeDTO } from '../../../models/farmFieldTypeDTO';

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
  selectIn:FarmFieldDTO[] = [];
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
    this.agFarms = this.navParams.get('selectedFarm');
    console.log(this.agFarms);
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
      this.formGroup.controls.farmFieldsId.setValue(field.id);
      this.formGroup.controls.farmFieldsTotalAreaType.setValue(field.totalAreaType);
      this.formGroup.controls.farmFieldsTypeName.setValue(field.farmFielType.typeName);
      this.formGroup.controls.farmFieldsTypeId.setValue(field.farmFielType.id);
    });

    //farm Cultiv Areas -  Milho,Soja,Algodao etc...
    this.agFarms[0].farmCultivAreas.forEach(fca=>{
      this.formGroup.controls.farmCATotalAreaSeed.setValue(fca.totalAreaSeed);
      this.formGroup.controls.farmCAHarvestNum.setValue(fca.harvestNum);
      this.formGroup.controls.farmSeed.setValue(fca.farmSeed);
      this.formGroup.controls.farmSeedName.setValue(fca.farmSeed.seedName);
    });

    //Farm Area - Propria || Arrendada
    this.agFarms[0].farmAreas.forEach(area=>{
      this.formGroup.controls.fATypeName.setValue(area.farmAreaType.typeName);
      this.formGroup.controls.fATotalArea.setValue(area.totalArea);
    });    
    
   // Work Machines - Parque de maquinas
   this.agFarms[0].workMachines.forEach(wm=>{
   });
  }

  loadSelectF(farmField){
    this.selectIn[0] = farmField;
    console.log(this.selectIn)
    this.formGroup.controls.farmFieldsToEdit.setValue(farmField.farmFielType.id)
    this.formGroup.controls.ffEditTotalAreaType.setValue(farmField.totalAreaType)
  }

  updateFarmField(){
    console.log(this.formGroup.value.ffEditTotalAreaType)
    this.formGroup.controls.farmFieldsTotalAreaType.setValue(this.formGroup.value.ffEditTotalAreaType);
    this.formGroup.controls.farmFieldsTypeName.setValue(this.formGroup.value.farmFieldsToEdit);
 }
}
