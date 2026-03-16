import { PartialType } from "@nestjs/mapped-types";
import { createProjectDto } from "./createProjectDto";




export class UpdateProjectDto extends PartialType (createProjectDto) {}