import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientSegmentationPage } from './client-segmentation';

@NgModule({
  declarations: [
    ClientSegmentationPage,
  ],
  imports: [
    IonicPageModule.forChild(ClientSegmentationPage),
  ],
})
export class ClientSegmentationPageModule {}
