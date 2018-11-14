import { FarmAreaTypeDTO } from "./farmAreaTypeDTO";
export interface FarmAreaDTO{
    id   : string;
    totalArea:number;
    farmAreaType: FarmAreaTypeDTO;
}