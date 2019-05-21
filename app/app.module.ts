import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MachineModelService} from '../services/domain/machineModel.service';
import { MachineChartService } from '../services/domain/machine-chart.service';
import { MachineBrandService } from '../services/domain/machineBrand.service';
import { MachineTypeService } from '../services/domain/machineType.service';
import { AgrosulLocationService } from '../services/domain/agrosulLocation.service';
import { ClientService } from '../services/domain/client.service';
import { AreaChartService } from '../services/domain/area-chart.service';
import {ScrollingHeaderModule} from 'ionic-scrolling-header';
import { MachineChartsPage } from '../pages/machine-charts/machine-charts';
import { AreaChartsPage } from '../pages/area-charts/area-charts';
import { ClientTablePage } from '../pages/client-table/client-table';
import { AreaChartsDetailPage } from '../pages/area-charts-detail/area-charts-detail';
import { UserService } from '../services/domain/user.service';
import { WorkMachineService } from '../services/domain/workMachine.service';
import { HomePage } from '../pages/home/home';
import { TypeClientService } from '../services/domain/typeClient.service';
import { ClientPage } from '../pages/client/client';
import { ClientFarmPage } from '../pages/client-farm/client-farm';
import { ClientMachinesPage } from '../pages/client-machines/client-machines';
import { ClientSegmentationPage } from '../pages/client-segmentation/client-segmentation';
import { Machinechart } from '../charts/machine-chart';


@NgModule({
  declarations: [
    MyApp,
    AreaChartsDetailPage,
    AreaChartsPage,
    ClientTablePage,
    ClientPage,
    ClientFarmPage,
    ClientMachinesPage,
    ClientSegmentationPage   
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxDatatableModule,
    IonicSelectableModule,
    ScrollingHeaderModule,
    
    IonicModule.forRoot(MyApp)
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AreaChartsDetailPage,
    AreaChartsPage,
    ClientTablePage,
    ClientPage,
    ClientFarmPage,
    ClientMachinesPage,
    ClientSegmentationPage

   ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MachineModelService,
    MachineChartService,
    MachineBrandService,
    MachineTypeService,
    AgrosulLocationService,
    ClientService,
    AreaChartService,
    UserService,
    TypeClientService,
    WorkMachineService,
    Machinechart
  ]
})
export class AppModule {}
