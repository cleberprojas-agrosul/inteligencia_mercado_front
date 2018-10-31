import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MachineBrandPage } from './machine-brand';

@NgModule({
  declarations: [
    MachineBrandPage,
  ],
  imports: [
    IonicPageModule.forChild(MachineBrandPage),
  ],
})
export class MachineBrandPageModule {}
