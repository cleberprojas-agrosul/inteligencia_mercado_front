import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AgrosulLocationDTO } from '../../models/agrosulLocationDTO';
import { AgrosulLocationService } from '../../services/domain/agrosulLocation.service';

/**
 * Generated class for the ClientSegmentationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-client-segmentation',
  templateUrl: 'client-segmentation.html',
})
export class ClientSegmentationPage {

  formGroup: FormGroup;
  agLocation: AgrosulLocationDTO[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuiler: FormBuilder,
    public agrosulLocationService: AgrosulLocationService,
  ) {
    this.formGroup = formBuiler.group({
      agLocationName: [] = [""],
      agLocationValue: [] = [0],
      lineLimit: [] = [9999],
    })
  }

  ionViewDidLoad() {
    this.loadAgrosulLocation(localStorage.getItem('userId'));
  }

  setLocationName(locationName) {
    this.formGroup.controls.agLocationName.setValue(locationName);
  }

  loadAgrosulLocation(userID) {
    if (localStorage.getItem('role') == 'admin') {
      var todos = new AgrosulLocationDTO();
      todos.id = '0';
      todos.locationName = 'Todos';
      this.agLocation.push(todos);
      todos = new AgrosulLocationDTO();
      todos.id = '901';
      todos.locationName = 'Agrosul 1 - BA/TO';
      this.agLocation.push(todos);
      todos = new AgrosulLocationDTO();
      todos.id = '902';
      todos.locationName = 'Agrosul 2 - PI';
      this.agLocation.push(todos);
    }
    this.agrosulLocationService.findAllByUserId(userID)
      .subscribe(response => {
        response.forEach(iten => {
          todos = new AgrosulLocationDTO();
          todos.id = iten.id;
          todos.locationName = iten.locationName;
          this.agLocation.push(todos);
        });
        if (this.agLocation != undefined || this.agLocation != null) {
          this.formGroup.controls.agLocationValue.setValue(this.agLocation[0].id)
        }
      },
        error => {
          console.log(error);
        });
  }

}
