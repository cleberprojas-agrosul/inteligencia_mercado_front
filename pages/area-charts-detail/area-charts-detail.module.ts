import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreaChartsDetailPage } from './area-charts-detail';
import {ScrollingHeaderModule} from 'ionic-scrolling-header';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    
    AreaChartsDetailPage,
  ],
  imports: [
    ScrollingHeaderModule,
    NgxDatatableModule,
    IonicPageModule.forChild(AreaChartsDetailPage),
  ],
})
export class AreaChartsPageModule {}
