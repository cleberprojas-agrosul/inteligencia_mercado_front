import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from "rxjs/Rx";
import { Platform } from "ionic-angular/platform/platform";
import { CredenciaisDTO } from "../../models/credenciasDTO";
import { UserDTO } from "../../models/userDTO";

@Injectable()
export class UserService{
    basePath = "/proxyApp";
    constructor(
        public http:HttpClient,
        private platform:Platform
        ){
            if(this.platform.is("cordova")){
                this.basePath = API_CONFIG.baseUrl;
            }
    }

    authenticate(creds : CredenciaisDTO) {
        let postData = {
            username: creds.username,
            password: creds.password
    }

         return this.http.post(`${this.basePath}/user/login`,
                creds,{
                    observe: 'response',
                    responseType: 'text'
                });
               
    }

    getUserLocations(userName:string,password:string): Observable<UserDTO>{
        return this.http.get<UserDTO>(`${this.basePath}/user/login?username=${userName}&password=${password}`)
   }

    
}