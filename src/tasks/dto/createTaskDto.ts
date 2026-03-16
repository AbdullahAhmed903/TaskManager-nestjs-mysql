import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsEnum, IsOptional, IsString, MinDate } from "class-validator"
import { Priority } from "src/generated/prisma/enums"


export class CreateTaskDto {
    @ApiProperty({ example: 'My Task' })
    @IsString()
    title: string

    @ApiProperty({ example: 'Task description', required: false })
    @IsOptional()
    @IsString()
    description?: string

    @ApiProperty({ example: '2026-12-01', required: false })
    @IsOptional()
    @Type(() => Date)
    @MinDate(new Date(), { message: 'Date must be in the future' })
    dueDate?: Date

    @ApiProperty({ enum: Priority, required: false })
    @IsOptional()
    @IsEnum(Priority)
    priority?: Priority
}