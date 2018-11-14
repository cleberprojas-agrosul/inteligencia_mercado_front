import { AgrosulLocationDTO } from "./agrosulLocationDTO";
import { FarmFieldDTO } from "./farmFieldDTO";
import { WorkMachineDTO } from "./workMachineDTO";
import { FarmCultivAreaDTO } from "./farmCultivAreaDTO";
import { FarmAreaDTO } from "./farmAreaDTO";

export interface FarmsDTO{
    id: string,
    name: string,
    farmName :  string ,
    phoneNumber : string,
    clientEmail :string   ,
    generalObs :  string ,
    totalAreaType : string,
    totalMainCulture : string,
    percentMainCulture : string,
    rankBySeedType : string,
    rankBySizeArea : string,
    totalArea : number
    agrosulLocation:AgrosulLocationDTO;
    farmFields:FarmFieldDTO[];
    farmCultivAreas:FarmCultivAreaDTO[];
    farmAreas:FarmAreaDTO[];   
    workMachines:WorkMachineDTO[];

    
}