import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ProjectService } from './project.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { JwtPayloadData } from 'src/common/interfaces/jwt-payload.interface';
import { createProjectDto } from './dto/createProjectDto';
import { UpdateProjectDto } from './dto/updateProjectDto';




@ApiTags('Project') 
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard,RolesGuard)
@Roles(['USER'])
@Controller('project')
export class ProjectController {
    constructor(private projectService:ProjectService){}

    

    @HttpCode(HttpStatus.CREATED)
    @Post("create-project")
    @ApiOperation({ summary: 'Create a new project' })
    @ApiResponse({ status: 201, description: 'Project created successfully' })
    @ApiResponse({ status: 400, description: 'Project name already exists' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async createProject(@Body() bodyData:createProjectDto,@CurrentUser() user:JwtPayloadData){        
        return this.projectService.createProject(bodyData,user)
    }


    
    @HttpCode(HttpStatus.OK)
    @Patch("update-project/:projectId")
    @ApiOperation({ summary: 'Update project' })
    @ApiResponse({ status: 200, description: 'Project Updated successfully' })
    @ApiResponse({ status: 400, description: 'Project name already exists' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async updateProejct(@Body() bodyData:UpdateProjectDto,@Param("projectId",ParseIntPipe) projectId:number,@CurrentUser() user:JwtPayloadData){        
        return this.projectService.updateProject(bodyData,user,projectId)
    }
}
