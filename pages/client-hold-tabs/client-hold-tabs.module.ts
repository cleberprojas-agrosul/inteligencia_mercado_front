import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientHoldTabsPage } from './client-hold-tabs';

@NgModule({
  declarations: [
    ClientHoldTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(ClientHoldTabsPage),
  ],
})
export class ClientHoldTabsPageModule {}
