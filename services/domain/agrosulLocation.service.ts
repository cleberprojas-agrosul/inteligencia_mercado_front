import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from "rxjs/Rx";
import { Platform } from "ionic-angular/platform/platform";
import { AgrosulLocationDTO } from "../../models/agrosulLocationDTO";


@Injectable()
export class AgrosulLocationService{
    basePath = "/proxyApp";
    constructor(
        public http:HttpClient,
        private platform:Platform
        ){
            if(this.platform.is("cordova")){
                this.basePath = API_CONFIG.baseUrl;
            }
    }

    findAll(): Observable<AgrosulLocationDTO[]>{
         return this.http.get<AgrosulLocationDTO[]>(`${this.basePath}/agrosulLocation/listAll`)
    }
    
    findAllByUserId(userID:number): Observable<AgrosulLocationDTO[]>{
        return this.http.get<AgrosulLocationDTO[]>(`${this.basePath}/agrosulLocation/listAllByUserId?userId=${userID}`)
   }
 
}