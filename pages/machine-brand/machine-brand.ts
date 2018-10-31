import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MachineBrandService} from '../../services/domain/machineBrand.service';
import { MachineBrandDTO } from '../../models/machineBrandDTO';

@IonicPage()
@Component({
  selector: 'page-machine-brand',
  templateUrl: 'machine-brand.html',
})
export class MachineBrandPage {

  brands : MachineBrandDTO[] = [];
  brand : MachineBrandDTO;
  
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public machineBrandService: MachineBrandService) {
  }

  ionViewDidLoad() {
    this.machineBrandService.findAll()
        .subscribe(response=>{
              this.brands = response;
              console.log(response)
        },
        error=>{
          console.log(error);
        });
    
  }
  
}
