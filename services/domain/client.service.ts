import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from "rxjs/Rx";
import { Platform } from "ionic-angular/platform/platform";
import { ClientDTO } from "../../models/clientDTO";
import { FarmsDTO } from "../../models/farmsDTO";

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
}