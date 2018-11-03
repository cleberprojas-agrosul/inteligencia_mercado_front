import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from "rxjs/Rx";
import { Platform } from "ionic-angular/platform/platform";
import { WorkMachineDTO } from "../../models/workMachineDTO";

@Injectable()
export class WorkMachineService{
    basePath = "/brandsApi";
    constructor(
        public http:HttpClient,
        private platform:Platform
        ){
            if(this.platform.is("cordova")){
                this.basePath = API_CONFIG.baseUrl;
            }
    }

    findById(machineId:number=0): Observable<WorkMachineDTO>{
         return this.http.get<WorkMachineDTO>(`${this.basePath}/workMachine/${machineId}`)
    }

 
}