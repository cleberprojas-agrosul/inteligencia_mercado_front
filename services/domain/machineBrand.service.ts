import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from "rxjs/Rx";
import { MachineBrandDTO } from "../../models/machineBrandDTO";
import { Platform } from "ionic-angular/platform/platform";
import { MachineTypeDTO } from "../../models/machineTypeDTO";
import { MachineModelChartDTO } from "../../models/charts/machineModelChartDTO";

@Injectable()
export class MachineBrandService{
    basePath = "/brandsApi";
    constructor(
        public http:HttpClient,
        private platform:Platform
        ){
            if(this.platform.is("cordova")){
                this.basePath = API_CONFIG.baseUrl;
            }
    }

    findAll(): Observable<MachineBrandDTO[]>{
         return this.http.get<MachineBrandDTO[]>(`${this.basePath}/brand/listBrands`)
    }

    findBrandByName(brandName:string): Observable<MachineBrandDTO[]>{
        return this.http.get<MachineBrandDTO[]>(`${this.basePath}/brand/findBrandByName?brandName=${brandName}`)
     }

    findConcurrencyByTypeMachine(typeMachine:String[],idLocation:number): Observable<MachineTypeDTO[]>{
        return this.http.get<MachineTypeDTO[]>(`${this.basePath}/brand/getTotalJDxConcorrencia?typeMachine=${typeMachine}&agLocation=${idLocation}`)
    }

    findMachineByBrandAndOwner(owner:String,brandName:String,typeMachine:String,idLocation:number): Observable<MachineModelChartDTO[]>{
        return this.http.get<MachineModelChartDTO[]>(`${this.basePath}/brand/getMachineByBrandAndOwner?typeMachine=${typeMachine}&owner=${owner}&brandName=${brandName}&agLocation=${idLocation}`)
    }
 
}