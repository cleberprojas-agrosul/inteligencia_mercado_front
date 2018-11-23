import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from "rxjs/Rx";
import { MachineModelDTO } from "../../models/machineModelDTO";
import { Platform } from "ionic-angular/platform/platform";

@Injectable()
export class MachineModelService{
    basePath = "/modelsApi";
    constructor(
        public http:HttpClient,
        private platform:Platform
        ){
            if(this.platform.is("cordova")){
                this.basePath = API_CONFIG.baseUrl;
            }
    }

    findAll(): Observable<MachineModelDTO[]>{
         return this.http.get<MachineModelDTO[]>(`${this.basePath}/model/listModels`)
    }

    findAllConcessionarias(): Observable<String[]>{
        return this.http.get<String[]>(`${this.basePath}/model/listConcessionarias`)
    }

    findAllAnoModelo(): Observable<String[]>{
        return this.http.get<String[]>(`${this.basePath}/model/listAllAnoModelo`)
    }

    findAllModelsByBrand(brandName:String=null): Observable<MachineModelDTO[]>{
        return this.http.get<MachineModelDTO[]>(`${this.basePath}/model/listModelsByBrand?brandName=${brandName}`)
    }

    
}