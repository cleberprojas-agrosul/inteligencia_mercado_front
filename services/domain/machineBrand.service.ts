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

    findConcurrencyByTypeMachine(typeMachine:String[],idLocation:number[],anoModelo:String[]=null): Observable<MachineTypeDTO[]>{
        return this.http.get<MachineTypeDTO[]>(`${this.basePath}/brand/getTotalJDxConcorrencia?typeMachine=${typeMachine}&agLocation=${idLocation}&anoModelo=${anoModelo}`)
    }

    findMachineByBrandAndOwner(owner:String,brandName:String,typeMachine:String,idLocation:number[]): Observable<MachineModelChartDTO[]>{
        return this.http.get<MachineModelChartDTO[]>(`${this.basePath}/brand/getMachineByBrandAndOwner?typeMachine=${typeMachine}&owner=${owner}&brandName=${brandName}&agLocation=${idLocation}`)
    }
 
    findMachinesByType(typeMachine:String,idLocation:number[],anoModelo:String[]=null): Observable<MachineModelChartDTO[]>{
        return this.http.get<MachineModelChartDTO[]>(`${this.basePath}/brand/findMachinesByType?typeMachine=${typeMachine}&agLocation=${idLocation}&anoModelo=${anoModelo}`)
    }

    findMachinesByYear(typeMachine:String,idLocation:number[],toFindValue:string=null,anoModelo:String[]=null): Observable<MachineModelChartDTO[]>{
        return this.http.get<MachineModelChartDTO[]>(`${this.basePath}/brand/findMachinesByYear?typeMachine=${typeMachine}&agLocation=${idLocation}&toFindValue=${toFindValue}&anoModelo=${anoModelo}`)
    }

    findMachinesByYearCvRange(typeMachine:String,idLocation:number[],toFindValue:string=null,anoModelo:String[]=null): Observable<MachineModelChartDTO[]>{
        return this.http.get<MachineModelChartDTO[]>(`${this.basePath}/brand/findMachinesByYearCvRange?typeMachine=${typeMachine}&agLocation=${idLocation}&toFindValue=${toFindValue}&anoModelo=${anoModelo}`)
    }

    findOwnersByYear(typeMachine:String,idLocation:number[],toFindValue:string=null,ano:string=null,chartType:string=null,marca:string=null): Observable<MachineModelChartDTO[]>{
        return this.http.get<MachineModelChartDTO[]>(`${this.basePath}/brand/findOwnersByYear?typeMachine=${typeMachine}&agLocation=${idLocation}&toFindValue=${toFindValue}&ano=${ano}&chartType=${chartType}&marca=${marca}`)
    }

    findOwnersByYearCvRange(typeMachine:String,idLocation:number[],toFindValue:string=null,ano:string=null,chartType:string=null,marca:string=null): Observable<MachineModelChartDTO[]>{
        return this.http.get<MachineModelChartDTO[]>(`${this.basePath}/brand/findOwnersByYearCvRange?typeMachine=${typeMachine}&agLocation=${idLocation}&toFindValue=${toFindValue}&ano=${ano}&chartType=${chartType}&marca=${marca}`)
    }

}