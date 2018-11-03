import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkMachinePage } from './work-machine';

@NgModule({
  declarations: [
    WorkMachinePage,
  ],
  imports: [
    IonicPageModule.forChild(WorkMachinePage),
  ],
})
export class WorkMachinePageModule {}
