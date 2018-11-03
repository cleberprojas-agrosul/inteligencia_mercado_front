import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrudClientPage } from './crud-client';

@NgModule({
  declarations: [
    CrudClientPage,
  ],
  imports: [
    IonicPageModule.forChild(CrudClientPage),
  ],
})
export class CrudClientPageModule {}
