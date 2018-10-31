import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/domain/user.service';
import { CredenciaisDTO } from '../../models/credenciasDTO';
import { UserDTO } from '../../models/userDTO';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  formGroup: FormGroup;
  loggedUser:UserDTO;
  constructor(public navCtrl: NavController,
              public formBuiler:FormBuilder,
              public userService: UserService) {
    this.formGroup = formBuiler.group({
      userName:['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
      userPassword:[]=[]
    });
  }

  ionViewDidLoad(){
    localStorage.clear();
  }

  login() {
    var cred = new CredenciaisDTO();
    cred.username = this.formGroup.value.userName;
    cred.password = this.formGroup.value.userPassword;
    this.userService.getUserLocations(cred.username,cred.password).subscribe(response=>{
      this.loggedUser = response;
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      localStorage.setItem('userId',this.loggedUser.id);
      localStorage.setItem('role',this.loggedUser.role);
      this.navCtrl.setRoot('WelcomePage');
    });
    
  }

}
