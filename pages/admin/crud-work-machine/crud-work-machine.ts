import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    var machine = this.navParams.get('selectedMachine');
    console.log(machine)
    console.log('ionViewDidLoad CrudWorkMachinePage');
  }

}
