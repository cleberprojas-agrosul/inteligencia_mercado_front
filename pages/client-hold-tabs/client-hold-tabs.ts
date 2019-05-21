import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClientPage } from '../client/client';
import { ClientDTO } from '../../models/clientDTO';
import { FarmsDTO } from '../../models/farmsDTO';
import { ClientFarmPage } from '../client-farm/client-farm';
import { ClientMachinesPage } from '../client-machines/client-machines';
/**
 * Generated class for the ClientHoldTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-client-hold-tabs',
  templateUrl: 'client-hold-tabs.html',
})
export class ClientHoldTabsPage {
  agClients: ClientDTO[] = [];
  agFarms: FarmsDTO[] = [];
  agClient: ClientDTO;

  tab1Root = ClientPage;
  tab2Root = ClientFarmPage;
  tab3Root = ClientMachinesPage;
  selectedClient : ClientDTO = this.navParams.get('selectedClient');
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

}
