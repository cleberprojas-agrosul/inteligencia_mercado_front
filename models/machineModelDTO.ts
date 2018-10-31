import { MachineBrandDTO } from "./machineBrandDTO";

export interface MachineModelDTO{
    id   : string;
    name : string;
    machineBrand: MachineBrandDTO;
}