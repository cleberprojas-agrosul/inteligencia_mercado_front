import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreaChartsPage } from './area-charts';
import {ScrollingHeaderModule} from 'ionic-scrolling-header';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    
    AreaChartsPage,
  ],
  imports: [
    ScrollingHeaderModule,
    NgxDatatableModule,
    IonicPageModule.forChild(AreaChartsPage),
  ],
})
export class AreaChartsPageModule {}
