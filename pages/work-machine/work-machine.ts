import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WorkMachineDTO } from '../../models/workMachineDTO';

/**
 * Generated class for the WorkMachinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-work-machine',
  templateUrl: 'work-machine.html',
})
export class WorkMachinePage {
  workMachine: WorkMachineDTO;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.workMachine = this.navParams.get('machine');
    console.log(this.workMachine);
  }

  ionViewDidLoad() {
   
  }

}
