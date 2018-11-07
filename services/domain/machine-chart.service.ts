import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from "rxjs/Rx";

import { Platform } from "ionic-angular/platform/platform";
import { MachineModelChartDTO } from "../../models/charts/machineModelChartDTO";

@Injectable()
export class MachineChartService{
    basePath = "/modelsApi";
    constructor(
        public http:HttpClient,
        private platform:Platform
        ){
            if(this.platform.is("cordova")){
                this.basePath = API_CONFIG.baseUrl;
            }
    }

    listTotalModelsByBrand(): Observable<MachineModelChartDTO[]>{
         return this.http.get<MachineModelChartDTO[]>(`${this.basePath}/model/listTotalModelsByBrand`)
    }

    listTotalModelsByClient(): Observable<MachineModelChartDTO[]>{
        return this.http.get<MachineModelChartDTO[]>(`${this.basePath}/model/listTotalMachinesByClient`)
    }
    
   findByFilters(marcaId:number = null, equipamentoId:number = null, equipamento:String =null,
                regiaoId:number[] = null, clientId:number = null,
                concessionaria:String =null,anoModelo:String=null, chartType:String=null,orderType:String=null,lineLimit:number=10  ): Observable<MachineModelChartDTO[]>{
    return this.http.get<MachineModelChartDTO[]>(`${this.basePath}/model/findFilters?marcaId=${marcaId}&equipamentoId=${equipamentoId}&equipamento=${equipamento}&regiaoId=${regiaoId}&clientId=${clientId}&concessionaria=${concessionaria}&ano=${anoModelo}&chartType=${chartType}&orderBy=${orderType}&lineLimit=${lineLimit}`)
   }
}