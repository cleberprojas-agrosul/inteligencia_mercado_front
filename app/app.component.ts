import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = 'HomePage';

  pages: Array<{title: string, component: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: 'WelcomePage' },
      { title: 'Gráficos de Máquinas', component: 'MachineChartsPage'},
      { title: 'Gráficos de Áreas', component: 'AreaChartsPage'},
      { title: 'Cliente', component: 'ClientTablePage'},
      { title: 'Sair', component: 'HomePage' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.show();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
