import { FarmFieldTypeDTO } from "./farmFieldTypeDTO";

export interface FarmFieldDTO{
    id   : string;
    totalAreaType:number;
    farmFielType: FarmFieldTypeDTO;
}