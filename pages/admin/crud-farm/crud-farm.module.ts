import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrudFarmPage } from './crud-farm';

@NgModule({
  declarations: [
    CrudFarmPage,
  ],
  imports: [
    IonicPageModule.forChild(CrudFarmPage),
  ],
})
export class CrudFarmPageModule {}
