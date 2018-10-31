import { TypeClientDTO } from "./typeClientDTO";
import { FarmsDTO } from "./farmsDTO";

export interface ClientDTO{
    id   : string;
    name : string;
    isClienteAgrosul:boolean;
    typeClient:TypeClientDTO;
    farms:FarmsDTO[];
}