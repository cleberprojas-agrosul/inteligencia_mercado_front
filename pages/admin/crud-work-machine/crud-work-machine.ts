import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { WorkMachineDTO } from '../../../models/workMachineDTO';
import { ToggleGesture } from 'ionic-angular/umd/components/toggle/toggle-gesture';

/**
 * Generated class for the CrudWorkMachinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crud-work-machine',
  templateUrl: 'crud-work-machine.html',
})
export class CrudWorkMachinePage {
  
  formGroup: FormGroup;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
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
    var machine:WorkMachineDTO = this.navParams.get('selectedMachine');
    this.populateForm(machine);
  }

  private populateForm(machine){
    this.formGroup.controls.workMachine.setValue(machine);
    this.formGroup.controls.wmId.setValue(machine.id);
    this.formGroup.controls.wmMachineBrand.setValue(machine.machineModel.machineBrand);
    this.formGroup.controls.wmMachineModel.setValue(machine.machineModel);
    this.formGroup.controls.wmTypeMachine.setValue(machine.typeMachine);
  }

}
