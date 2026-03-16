import { IsAlpha, IsNotEmpty, IsNumber } from "class-validator";



export class AssignTaskDto{
    
    @IsNotEmpty()
    @IsNumber()
    taskId: number;
    
    @IsNotEmpty()
    @IsNumber()
    userId: number;


}