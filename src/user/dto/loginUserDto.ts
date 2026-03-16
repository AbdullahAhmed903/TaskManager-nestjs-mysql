import {ApiProperty } from "@nestjs/swagger"
import { IsEmail, Matches, MaxLength, MinLength } from "class-validator"




export class LoginDto {
    @ApiProperty({example:"abdullahahmed02000@gmail.com", description: 'Only Gmail or Yahoo emails are allowed'})
    @IsEmail()
      @Matches(/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|app.com)$/, {
        message: 'Only Gmail or Yahoo emails are allowed',
        })
    email:string


    @ApiProperty({ 
    example: 'Password@123',
    description: 'Must be 8-20 characters, contain uppercase, lowercase, number and special character',
    minLength: 8,
    maxLength: 20
    })
        @MinLength(8,{message:"password must be at least 8 characters"})
        @MaxLength(20,{message:"password must be less than 20 characters"})
         @Matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            {
            message:
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            },
            )
    password:string
}