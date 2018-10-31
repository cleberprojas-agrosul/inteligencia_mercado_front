import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MachineModelPage } from './machine-model';

@NgModule({
  declarations: [
    MachineModelPage,
  ],
  imports: [
    IonicPageModule.forChild(MachineModelPage),
  ],
})
export class MachineModelPageModule {}
