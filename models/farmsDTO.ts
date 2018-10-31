import { AgrosulLocationDTO } from "./agrosulLocationDTO";
import { FarmFieldDTO } from "./farmFieldDTO";
import { WorkMachineDTO } from "./workMachineDTO";

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
    farmCultivAreas:{totalAreaSeed:number,harvestNum:number,
                    farmSeed:{seedName:String}}[];
    farmAreas:{totalArea:number,farmAreaType:{typeName:String }}[];   
    workMachines:WorkMachineDTO[];

    
}