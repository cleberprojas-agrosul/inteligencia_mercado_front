import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from "rxjs/Rx";
import { Platform } from "ionic-angular/platform/platform";
import { TypeClientDTO } from "../../models/typeClientDTO";

@Injectable()
export class TypeClientService{
    basePath = "/proxyApp";
    constructor(
        public http:HttpClient,
        private platform:Platform
        ){
            if(this.platform.is("cordova")){
                this.basePath = API_CONFIG.baseUrl;
            }
    }

    
    findAll(): Observable<TypeClientDTO[]>{
        return this.http.get<TypeClientDTO[]>(`${this.basePath}/typeClient/listTypeClient`)
    }

    
}