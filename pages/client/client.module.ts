import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientPage } from './client';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    ClientPage,
  ],
  imports: [
    IonicPageModule.forChild(ClientPage),
    IonicSelectableModule
  ],
})
export class ClientPageModule {}
