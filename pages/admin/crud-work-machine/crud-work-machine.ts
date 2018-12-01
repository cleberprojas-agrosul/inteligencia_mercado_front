import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { WorkMachineDTO } from '../../../models/workMachineDTO';
import { ToggleGesture } from 'ionic-angular/umd/components/toggle/toggle-gesture';
import { MachineBrandService } from '../../../services/domain/machineBrand.service';
import { MachineModelService } from '../../../services/domain/machineModel.service';
import { MachineBrandDTO } from '../../../models/machineBrandDTO';
import { MachineModelDTO } from '../../../models/machineModelDTO';
import { MachineTypeService } from '../../../services/domain/machineType.service';
import { MachineTypeDTO } from '../../../models/machineTypeDTO';
import { ChartUtils } from '../../../Utils/charts-utils';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@IonicPage()
@Component({
  selector: 'page-crud-work-machine',
  templateUrl: 'crud-work-machine.html',
})
export class CrudWorkMachinePage {
  
  formGroup: FormGroup;
  machine:WorkMachineDTO;
  listAllBrands:MachineBrandDTO[];
  listAllModels:MachineModelDTO[];
  listAllMachineTypes:MachineTypeDTO[];
  lblDetailOne = "";
  lblDetailTwo = "";
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public machineBrandService: MachineBrandService,
              public machineModelService: MachineModelService,
              public machineTypeService:MachineTypeService,
              public formBuilder: FormBuilder) {

              this.formGroup = formBuilder.group({
                workMachine:[] = [],
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

                wmDetailOne:[]=[],
                wmDetailTwo:[]=[],

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
                wmTypeMTipoEquipamento:[] =[]
              });
  }

  ionViewDidLoad() {
    this.findAllBrands();
    this.machine = this.navParams.get('selectedMachine')[0];
    this.populateForm(this.machine);
    this.findAllModelsByBrand();
    this.findAllMachineType();
  }

  private populateForm(machine){
    this.formGroup.controls.workMachine.setValue(machine);
    this.formGroup.controls.wmId.setValue(machine.id);
    this.formGroup.controls.wmMachineYear.setValue(machine.machineYear);
    this.formGroup.controls.wmMachineQtd.setValue(machine.machineQtd);
    this.formGroup.controls.wmMachineName.setValue(machine.name);
    
    this.formGroup.controls.wmMachineBrand.setValue(machine.machineModel.machineBrand);
    this.formGroup.controls.wmMachineBrandName.setValue(machine.machineModel.machineBrand.name);
    this.formGroup.controls.wmMachineBrandId.setValue(machine.machineModel.machineBrand.id);

    this.formGroup.controls.wmMachineModel.setValue(machine.machineModel);
    this.formGroup.controls.wmMachineModelId.setValue(machine.machineModel.id);
    this.formGroup.controls.wmMachineModelName.setValue(machine.machineModel.name);

    this.formGroup.controls.wmTypeMachine.setValue(machine.typeMachine);
    this.formGroup.controls.wmTypeMachineId.setValue(machine.typeMachine.id);
    this.formGroup.controls.wmTypeMachineName.setValue(machine.typeMachine.typeName);
    this.fillMachineTypeDetail(machine)
  }

  fillMachineTypeDetail(machine){
    var typeMachine = machine.typeMachine;
    switch(typeMachine.typeName.trim()){
        case ChartUtils.MACHINE_TYPE_TRACTOR:{
          this.lblDetailOne="Potência (CV)"
          this.fillDetailData(machine.tractorHorsePower,"");
          break;
        }
        case ChartUtils.MACHINE_TYPE_HARVESTER:{
          this.lblDetailOne="Tipo de Plataforma"
          this.lblDetailTwo="Tamanho"
          this.fillDetailData(machine.harvesterHeadType,machine.harvesterFeet);
          break;  
        }
        case ChartUtils.MACHINE_TYPE_PLANTER:{
          this.lblDetailOne="Nº Linhas"
          this.lblDetailTwo="Dist. Entre Linhas"
          this.fillDetailData(machine.planterLineNumbers,machine.planterBetweenLines);
          break;  
        }
        case ChartUtils.MACHINE_TYPE_SPRAYER:{
          this.lblDetailOne="Tamanho de Barra"
          this.fillDetailData(machine.sprayerBarLength,"");
          break;  
        }
        case ChartUtils.MACHINE_TYPE_COTTON:{
          this.lblDetailOne="Tipo "
          this.fillDetailData(machine.cottonType,"");
          break;  
        }
    }
  }

  fillDetailData(detailOne, detailTwo){
    this.formGroup.controls.wmDetailOne.setValue(detailOne);
    this.formGroup.controls.wmDetailTwo.setValue(detailTwo);
  }

   findAllBrands(){
    if(this.listAllBrands==null || this.listAllBrands==undefined){
      this.machineBrandService.findAll().subscribe(response=>{
        this.listAllBrands = response;
      });
    } 
  }

  findAllModelsByBrand(){
      this.machineModelService
          .findAllModelsByBrand(this.formGroup.value.wmMachineBrandName)
          .subscribe(response=>{
            this.listAllModels = response;
          });
  }

  findAllMachineType(){
    this.machineTypeService.findAll().subscribe(response=>{
      this.listAllMachineTypes = response;
    });
  }

  refreshMachineModels(brand){
    this.machine.machineModel.machineBrand = brand;
    this.machineModelService
    .findAllModelsByBrand(brand.name)
    .subscribe(response=>{
      this.listAllModels = response;
    });
  }

  updateSelectTypeMachine(type){
    this.machine.typeMachine = type;
  }

  updateSelectModel(model){
    this.machine.machineModel = model;
  }

  saveWorkMachine(){
    this.fromFormToObject()
    this.navCtrl.popTo("CrudFarmPage")
  }

  fromFormToObject(){
    this.machine.id=   this.formGroup.value.wmId;
    this.machine.machineYear = this.formGroup.value.wmMachineYear;
    this.machine.machineQtd =  this.formGroup.value.wmMachineQtd;
    this.machine.machineName = this.formGroup.value.wmMachineName;
    this.fillMachineTypeDetailFromForm();
  }

  fillMachineTypeDetailFromForm(){
    var typeMachine = this.machine.typeMachine;
    switch(typeMachine.typeName.trim()){
        case ChartUtils.MACHINE_TYPE_TRACTOR:{
          this.machine.tractorHorsePower = this.formGroup.value.detailOne;
          break;
        }
        case ChartUtils.MACHINE_TYPE_HARVESTER:{
          this.machine.harvesterFeet     = this.formGroup.value.detailTwo;
          this.machine.harvesterHeadType =  this.formGroup.value.detailOne;
          break;  
        }
        case ChartUtils.MACHINE_TYPE_PLANTER:{
          this.machine.planterLineNumbers  = this.formGroup.value.detailTwo;
          this.machine.planterBetweenLines = this.formGroup.value.detailOne;
          break;  
        }
        case ChartUtils.MACHINE_TYPE_SPRAYER:{
          this.machine.sprayerBarLength = this.formGroup.value.detailOne;
          break;  
        }
        case ChartUtils.MACHINE_TYPE_COTTON:{
          this.machine.cottonType = this.formGroup.value.detailOne;
          break;  
        }
    }
  }
}