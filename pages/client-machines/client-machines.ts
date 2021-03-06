import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClientDTO } from '../../models/clientDTO';
import { FarmsDTO } from '../../models/farmsDTO';

/**
 * Generated class for the ClientMachinesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-client-machines',
  templateUrl: 'client-machines.html',
})
export class ClientMachinesPage {

  agClients: ClientDTO[] = [];
  agFarms: FarmsDTO[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.agClients[0] = this.navParams.data;
    this.agFarms =  this.agClients[0].farms;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClientMachinesPage');
  }

}
