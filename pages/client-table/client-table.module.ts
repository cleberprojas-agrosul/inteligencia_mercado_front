import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientTablePage } from './client-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    ClientTablePage,
  ],
  imports: [
    IonicPageModule.forChild(ClientTablePage),
    NgxDatatableModule
  ],
})
export class ClientTablePageModule {}
