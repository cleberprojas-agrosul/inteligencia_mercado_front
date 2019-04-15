import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientFarmPage } from './client-farm';

@NgModule({
  declarations: [
    ClientFarmPage,
  ],
  imports: [
    IonicPageModule.forChild(ClientFarmPage),
  ],
})
export class ClientFarmPageModule {}
