import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/createTaskDto';
import { UpdateTaskDto } from './dto/updateTaskDto';
import { Throttle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateTaskStatusDto } from './dto/updateTaskStatusDto';
import type { JwtPayloadData } from 'src/common/interfaces/jwt-payload.interface';
import { AssignTaskDto } from './dto/assignTaskDto';

@ApiTags('Tasks') 
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard,RolesGuard)
@Controller('tasks')
export class TasksController {
  constructor(private taskService:TaskService ) {}


  //..................Create Task..........................//
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Throttle({default: { ttl: 60000, limit: 20 }})
  @HttpCode(HttpStatus.CREATED)
  @Roles(['SUPER_ADMIN',"ADMIN"])
  @Post("create-task")
  createTask(@Body() body: CreateTaskDto,@CurrentUser() user:JwtPayloadData) {
    return this.taskService.createTask(body,user);
  }


  //.....................Update Task..........................//
  @ApiOperation({ summary: 'Update a Specific task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Task not found or you do not have permission' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @HttpCode(HttpStatus.OK)
  @Roles(['SUPER_ADMIN',"ADMIN"])
  @Patch("update-task/:taskId")
  updateTask(@Body() body:UpdateTaskDto,@Param("taskId",ParseIntPipe) param:number,@CurrentUser() user:JwtPayloadData){
    return this.taskService.updateTask(body,param,user)
  }


  //.....................Delete Task..........................//
  @ApiOperation({ summary: 'Delete a Specific task' })
  @ApiOperation({description:"you must be login"})
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 400, description: 'Task Already Delete or not Exist' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Roles(['SUPER_ADMIN',"ADMIN"])
  @Delete("/delete-task/:taskId")
  deleteTask(@Param("taskId",ParseIntPipe) param:number,@CurrentUser() user:JwtPayloadData){
    return this.taskService.deleteTask(param,user)
  }

  //.....................Get Task By Id..........................//
  @ApiOperation({ summary: 'Get Task By Id' })
  @ApiResponse({ status: 200, description: 'Task fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get(":taskId")
  @HttpCode(HttpStatus.OK)
  getTask(@Param("taskId",ParseIntPipe) taskId:number,@CurrentUser() user:JwtPayloadData){
    return this.taskService.getTaskById(taskId,user);
  }



  //.....................Get All Tasks Beased On Roles With Filter..........................//
  @ApiOperation({ summary: 'Get All Tasks' })
  @ApiResponse({ status: 200, description: 'Tasks fetched successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get()
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(['USER',"ADMIN","SUPER_ADMIN"])
  getAllTasks(@Query() query:any,@CurrentUser() user:JwtPayloadData) {
    return this.taskService.getAllTasks(user.id, user.role,query.page,query.limit); 
  }



  //.....................Update Task By Status..........................//

  @ApiOperation({summary:"Update Task Status"})
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 400, description: 'Status is required Or Invalid status value' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Roles(['SUPER_ADMIN',"ADMIN","USER"])
  @Patch("update-status/:taskId")
  updateStatus(@Param("taskId", ParseIntPipe) taskId:number,@Body() body:UpdateTaskStatusDto,@CurrentUser() user:any){
    return this.taskService.updateStatus(taskId, user,body)
  }


  //......................Assign Task To User........................//
  
  @ApiOperation({summary:"Assign Task to project"})
  @ApiResponse({ status: 200, description: 'Task Assigned successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Roles(["ADMIN","SUPER_ADMIN"])
  @HttpCode(HttpStatus.OK)
  @Post("assign-task")
  assignTask( @Body() ids: AssignTaskDto){
    return this.taskService.assignUserTask(ids)
  }


}
