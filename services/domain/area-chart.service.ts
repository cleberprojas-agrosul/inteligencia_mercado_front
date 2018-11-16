import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from "rxjs/Rx";

import { Platform } from "ionic-angular/platform/platform";
import { MachineModelChartDTO } from "../../models/charts/machineModelChartDTO";
import { SeedTypeDTO } from "../../models/seedTypeDTO";
import { AreaChartDTO } from "../../models/charts/areaChartDTO";
import { AreaFilterDTO } from "../../models/areaFilterDTO";

@Injectable()
export class AreaChartService{
    basePath = "/proxyApp";
    constructor(
        public http:HttpClient,
        private platform:Platform
        ){
            if(this.platform.is("cordova")){
                this.basePath = API_CONFIG.baseUrl;
            }
    }

    listAllSeedType(): Observable<SeedTypeDTO[]>{
         return this.http.get<SeedTypeDTO[]>(`${this.basePath}/farm/listAllSeedType`)
    }

    listAllSeedTypeByLocation(field:String[],filter:AreaFilterDTO): Observable<AreaChartDTO[]>{
        return this.http.get<AreaChartDTO[]>(`${this.basePath}/farm/getTotalAreaByCultivType?seedName=${field}&regiao=${filter.agLocationId}&proprietario=${filter.clientValue}&area=${filter.farmArea}&chartType=${filter.chartTypeX}`)
    }

    getSeedRanking(): Observable<String[]>{
        return this.http.get<String[]>(`${this.basePath}/farm/getSeedRanking`)
    }

    getTotalAreaByState(): Observable<String[]>{
        return this.http.get<String[]>(`${this.basePath}/farm/getTotalAreaByState`)
    }

    getAreasByFilters(agLocationValue:number[]=null,tamanhoPorCultura:string=null,classPorCor:string=null): Observable<AreaChartDTO[]>{
        return this.http.get<AreaChartDTO[]>(`${this.basePath}/farm/getAreasByFilters?regiaoAgrosul=${agLocationValue}&tamanhoTpCultura=${tamanhoPorCultura}&classPorCor=${classPorCor}`)
    }

    getProprietariosByTamanhoAreaCultura(agLocationValue:number[]=null,tamanhoPorCultura:string=null,tamanhoTpArea:String=null,classPorCor:String=null): Observable<AreaChartDTO[]>{
        return this.http.get<AreaChartDTO[]>(`${this.basePath}/farm/getProprietariosByTamanhoAreaCultura?regiaoAgrosul=${agLocationValue}&tamanhoTpCultura=${tamanhoPorCultura}&tamanhoTpArea=${tamanhoTpArea}&classPorCor=${classPorCor}`)
    }
    
    getTotalAreaCultivGP(agLocationValue:number[]=null,tamanhoPorCultura:string=null): Observable<AreaChartDTO[]>{
        return this.http.get<AreaChartDTO[]>(`${this.basePath}/farm/getTotalAreaCultivGP?regiaoAgrosul=${agLocationValue}&tamanhoTpCultura=${tamanhoPorCultura}`)
    }
    
}