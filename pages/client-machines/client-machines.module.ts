import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientMachinesPage } from './client-machines';

@NgModule({
  declarations: [
    ClientMachinesPage,
  ],
  imports: [
    IonicPageModule.forChild(ClientMachinesPage),
  ],
})
export class ClientMachinesPageModule {}
