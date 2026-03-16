import { PartialType } from "@nestjs/mapped-types";
import { IsEnum, IsOptional } from "class-validator";
import { CreateTaskDto } from "./createTaskDto";



export class UpdateTaskDto extends PartialType(CreateTaskDto){
    @IsOptional()
    @IsEnum(['PENDING','DONE','IN_PROGRESS'])
    status:string
}