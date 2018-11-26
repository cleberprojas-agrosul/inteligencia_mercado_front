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

@IonicPage()
@Component({
  selector: 'page-crud-work-machine',
  templateUrl: 'crud-work-machine.html',
})
export class CrudWorkMachinePage {
  
  formGroup: FormGroup;

  listAllBrands:MachineBrandDTO[];
  listAllModels:MachineModelDTO[];
  listAllMachineTypes:MachineTypeDTO[];
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
    var machine:WorkMachineDTO = this.navParams.get('selectedMachine')[0];
    this.populateForm(machine);
    this.findAllModelsByBrand();
    this.findAllMachineType();
  }

  private populateForm(machine){
    this.formGroup.controls.workMachine.setValue(machine);
    this.formGroup.controls.wmId.setValue(machine.id);
    
    this.formGroup.controls.wmMachineBrand.setValue(machine.machineModel.machineBrand);
    this.formGroup.controls.wmMachineBrandName.setValue(machine.machineModel.machineBrand.name);
    this.formGroup.controls.wmMachineBrandId.setValue(machine.machineModel.machineBrand.id);

    this.formGroup.controls.wmMachineModel.setValue(machine.machineModel);
    this.formGroup.controls.wmMachineModelId.setValue(machine.machineModel.id);
    this.formGroup.controls.wmMachineModelName.setValue(machine.machineModel.name);

    this.formGroup.controls.wmTypeMachine.setValue(machine.typeMachine);
    this.formGroup.controls.wmTypeMachineId.setValue(machine.typeMachine.id);
    this.formGroup.controls.wmTypeMachineName.setValue(machine.typeMachine.typeName);
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
            console.log(this.listAllModels)
          });
  }

  findAllMachineType(){
    this.machineTypeService.findAll().subscribe(response=>{
      this.listAllMachineTypes = response;
    });
  }

  refreshMachineModels(brand){
    this.machineModelService
    .findAllModelsByBrand(brand.name)
    .subscribe(response=>{
      this.listAllModels = response;
    });
    
  }
}