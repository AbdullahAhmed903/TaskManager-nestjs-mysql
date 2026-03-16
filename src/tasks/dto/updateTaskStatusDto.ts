import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { Status } from "src/generated/prisma/enums";


export class UpdateTaskStatusDto {
    @ApiProperty({ enum: Status })
    @IsNotEmpty()
    @IsEnum(Status, { message: 'Invalid status value ' })
    status: Status;
}
