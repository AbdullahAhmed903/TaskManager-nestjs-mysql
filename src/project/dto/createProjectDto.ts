import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength, MinDate, MinLength, ValidationArguments } from "class-validator";



export class createProjectDto {
     @ApiProperty({example:"project one",minLength: 5,maxLength: 20})
    @IsNotEmpty()
    @IsString()
    @MinLength(5,{message:(args:ValidationArguments)=>{
        return args.property+' should be at least '+args.constraints[0]+' characters long';
    }})
    @MaxLength(20,
     {message:(args:ValidationArguments)=>{
        return args.property+' should be less than '+args.constraints[0]+' characters long';
     }})
     name: string;

     @ApiProperty({example:"this poejct about task manager"})
     @IsOptional()
     @IsString()
       @MaxLength(300,
     {message:(args:ValidationArguments)=>{
        return args.property+' should be less than '+args.constraints[0]+' characters long';
     }})
     description?: string;

     
     @ApiProperty({example:"2022-05-21"})
     @IsNotEmpty({message:"EndDate is required"})
     @IsDateString({}, {message:"date must be in valid format"})
     startDate: string
      @ApiProperty({example:"2022-09-21"})
     @IsNotEmpty({message:"EndDate is required"})
     @IsDateString({}, {message:"date must be in valid format"})
     endDate:string
}