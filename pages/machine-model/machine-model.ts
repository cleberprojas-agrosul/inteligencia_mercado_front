import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MachineModelService} from '../../services/domain/machineModel.service';
import { MachineModelDTO } from '../../models/machineModelDTO';


/**
 * Generated class for the MachineModelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-machine-model',
  templateUrl: 'machine-model.html',
})
export class MachineModelPage {

  items : MachineModelDTO[];
 
 

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public machineModelService: MachineModelService) {
  }

  ionViewDidLoad() {

    this.machineModelService.findAll()
        .subscribe(response=>{
              this.items = response;
        },
        error=>{
          console.log(error);
        });
    
  }
}
