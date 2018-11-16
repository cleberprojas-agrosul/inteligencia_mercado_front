import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrudWorkMachinePage } from './crud-work-machine';

@NgModule({
  declarations: [
    CrudWorkMachinePage,
  ],
  imports: [
    IonicPageModule.forChild(CrudWorkMachinePage),
  ],
})
export class CrudWorkMachinePageModule {}
