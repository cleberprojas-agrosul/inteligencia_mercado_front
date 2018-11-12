import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from "rxjs/Rx";
import { Platform } from "ionic-angular/platform/platform";
import { ClientDTO } from "../../models/clientDTO";
import { FarmsDTO } from "../../models/farmsDTO";
import { AgrosulClassificationDTO } from "../../models/agrosulClassificationDTO";

@Injectable()
export class ClientService{
    basePath = "/proxyApp";
    constructor(
        public http:HttpClient,
        private platform:Platform
        ){
            if(this.platform.is("cordova")){
                this.basePath = API_CONFIG.baseUrl;
            }
    }

    findAllNames(): Observable<ClientDTO[]>{
         return this.http.get<ClientDTO[]>(`${this.basePath}/client/listAllClientsName`)
    }

    findAll(): Observable<ClientDTO[]>{
        return this.http.get<ClientDTO[]>(`${this.basePath}/client/listClients`)
    }

    findById(id:number ): Observable<ClientDTO>{
        return this.http.get<ClientDTO>(`${this.basePath}/client/${id}`)
    }

    findAllFarmsByClientId(clientId:number): Observable<FarmsDTO[]>{
        return this.http.get<FarmsDTO[]>(`${this.basePath}/farm/listAllFarms/${clientId}`)
    }

    findAllFarmsByAgLocation(agLocation:number,clientId:number): Observable<ClientDTO[]>{
        return this.http.get<ClientDTO[]>(`${this.basePath}/client/findClientFarmsByAgLocation?regiao=${agLocation}&clientId=${clientId}`)
    }

    findAllClientsByAgLocationID(regiao:number[]): Observable<ClientDTO[]>{
        return this.http.get<ClientDTO[]>(`${this.basePath}/client/findClientFarmsByAgLocationId?regiao=${regiao}`)
    }

    findClientByMultipleLocationAndPorte(regiao:number[],porte:String): Observable<ClientDTO[]>{
        return this.http.get<ClientDTO[]>(`${this.basePath}/client/findClientByMultipleLocationAndPorte?regiao=${regiao}&porte=${porte}`)
    }

    findClientsByColorClass(regiao:number[],porte:String,tamArea:String): Observable<AgrosulClassificationDTO[]>{
        return this.http.get<AgrosulClassificationDTO[]>(`${this.basePath}/client/findClientsByColorClass?regiao=${regiao}&porte=${porte}&tamArea=${tamArea}`)
    }
    
}