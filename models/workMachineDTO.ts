import { MachineModelDTO } from "./machineModelDTO";
import { MachineTypeDTO } from "./machineTypeDTO";

export interface WorkMachineDTO{
    id   : string;
    name : string;
    tractorHorsePower:number;
    harvesterFeet:string;
    machineQtd:number;
    harvesterHeadType:string;
    sprayerBarLength:string;
    planterLineNumbers:string;
    planterBetweenLines:string;
    solidDistVolume:string;
    cottonType:string;
    machineName:string;
    machineYear:string;
    machineModel: MachineModelDTO;
    typeMachine:MachineTypeDTO;

}