import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MachineChartsPage } from './machine-charts';
import { IonicSelectableModule } from 'ionic-selectable';
import { ScrollingHeaderModule } from 'ionic-scrolling-header';

@NgModule({
  declarations: [
    MachineChartsPage,
  ],
  imports: [
    ScrollingHeaderModule,
    IonicPageModule.forChild(MachineChartsPage),
    IonicSelectableModule
  ],
})
export class MachineChartsPageModule {}
