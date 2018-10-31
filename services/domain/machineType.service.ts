import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from "rxjs/Rx";
import { Platform } from "ionic-angular/platform/platform";
import { MachineTypeDTO } from "../../models/machineTypeDTO";

@Injectable()
export class MachineTypeService{
    basePath = "/typesApi";
    constructor(
        public http:HttpClient,
        private platform:Platform
        ){
            if(this.platform.is("cordova")){
                this.basePath = API_CONFIG.baseUrl;
            }
    }

    findAll(): Observable<MachineTypeDTO[]>{
         return this.http.get<MachineTypeDTO[]>(`${this.basePath}/typeMachine/listTypeMachines`)
    }
}