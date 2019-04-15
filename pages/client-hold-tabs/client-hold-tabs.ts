import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AreaChartsDetailPage } from '../area-charts-detail/area-charts-detail';
import { ClientTablePage } from '../client-table/client-table';
import { ClientPage } from '../client/client';
import { ClientDTO } from '../../models/clientDTO';
import { FarmsDTO } from '../../models/farmsDTO';
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

  tab1Root = AreaChartsDetailPage;
  tab2Root = ClientPage;
  tab3Root = ClientTablePage;
  agClients: ClientDTO[] = [];
  agFarms: FarmsDTO[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.agClients = this.navParams.get('selectedClient');
    this.agFarms   = this.agClients[0].farms;
    console.log('ionViewDidLoad ClientHoldTabsPage');
  }

}
