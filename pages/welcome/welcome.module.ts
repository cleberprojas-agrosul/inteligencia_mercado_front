import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomePage } from './welcome';
import { MachineChartsPage } from '../machine-charts/machine-charts';
import { AreaChartsPage } from '../area-charts/area-charts';
import { ClientTablePage } from '../client-table/client-table';


@NgModule({
  declarations: [
    WelcomePage
    
  ],
  imports: [
    IonicPageModule.forChild(WelcomePage)
  ],
})
export class WelcomePageModule {}
