import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClientService } from '../../services/domain/client.service';
import { ClientDTO } from '../../models/clientDTO';
import { AgrosulLocationService } from '../../services/domain/agrosulLocation.service';
import { AgrosulLocationDTO } from '../../models/agrosulLocationDTO';

/**
 * Generated class for the ClientTablePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-client-table',
  templateUrl: 'client-table.html',
})
export class ClientTablePage {
  
  tablestyle = 'bootstrap';
  dataClient: ClientDTO;
  agClients: ClientDTO[] = [];
  temp = [];
  rows: ClientDTO[] = []
  agLocation: AgrosulLocationDTO[] = [];
  
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public agrosulLocationService: AgrosulLocationService,
              public clientService: ClientService) {
  }

  switchStyle() {
    if (this.tablestyle == 'dark') {
      this.tablestyle = 'bootstrap';
    } else {
      this.tablestyle = 'dark';
    }
  }

  ionViewDidLoad() {
  //  this.loadClients();
    this.loadAgrosulLocation(localStorage.getItem('userId'));  
  }

  loadClients(){
    var regioes:any[]=[0];
    var i=0;
    this.agLocation.forEach(r=>{ regioes[i]= r.id;i++});
    this.clientService.findAllClientsByAgLocationID(regioes)
    .subscribe(response=>{
      this.agClients = response;
      this.rows = this.agClients;
    },
    error=>{console.log(error)});
  }

  loadAgrosulLocation(userID){
		this.agrosulLocationService.findAllByUserId(userID)
			.subscribe(response=>{
				this.agLocation = response
		},
		error=>{
				console.log(error);
		});	
	}

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.agClients.filter(function(d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
  }

  open(row){
    var data:any;
    this.clientService.findById(row.id).subscribe(response=>{
        var cli : ClientDTO[] =[response];
        data = { selectedClient :cli };
        this.navCtrl.push('ClientPage',data);
    });    
  }

  edit(row){
    var data:any;
    this.clientService.findById(row.id).subscribe(response=>{
        var cli : ClientDTO[] =[response];
        data = { selectedClient :cli };
        this.navCtrl.push('CrudClientPage',data);
    });    
  }

  addClient(){
    this.navCtrl.push('CrudClientPage');
  }

}