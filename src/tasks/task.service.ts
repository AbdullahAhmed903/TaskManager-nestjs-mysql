import { BadRequestException, ConflictException, HttpException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { TaskRepository } from "./task.repository";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { AssignTaskDto } from "./dto/assignTaskDto";
import { JwtPayloadData } from "src/common/interfaces/jwt-payload.interface";
import { ProjectRepository } from "src/project/project.respository";
import { createPaginationResult, getPaginationParams } from "src/common/utils/Pagination";
import { UserRepository } from "src/user/user.repository";

@Injectable()
export class TaskService{
   constructor(private taskRepository:TaskRepository,private projectRepository:ProjectRepository,
    private userRepository:UserRepository,@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger){}

    async createTask(body:any,user:JwtPayloadData){
        try {
        const result=await this.taskRepository.uniqueTaskName(body.title,user.id)
        if(result){
            throw new BadRequestException("There is Task with same name")
        }
        const task=await this.taskRepository.createTask({
            ...body,
            createdById:user.id
        })
        return {message:"Task created successfully", data:task}
        } catch (error) {
            this.logger.error('INTERNAL_SERVER_ERROR', { error: error.message });
            throw new InternalServerErrorException('Something went wrong')
        }
}   

    async updateTask(body:any,param:number,user:JwtPayloadData){
        try {
        if(body.title){
            const uniqueName=await this.taskRepository.uniqueTaskName(body.title,user.id,param)
            if(uniqueName){
                throw new BadRequestException("There is Task with same name")
            }
        }
        const updatedTask=await this.taskRepository.updateTask(param,body)
        return {message:"Task Updated Successfully",data:updatedTask}
        } catch (error) {
         this.handleError(error,"someThing went wrong")
        }
}

    async deleteTask(param:number,user:JwtPayloadData){
       try { 
        const checkTask=await this.taskRepository.findTaskById(param,{})
        if(!checkTask){
            throw new BadRequestException("Task Already Delete or not Exist")
        }
        const taskDeletaion=await this.taskRepository.deleteTask(param,user.id)
        if(taskDeletaion){
            return {message:"Task Deleted Successfully",data:null}
        }
       } catch (error) {
            this.handleError(error,"SomeThing wnet wrong")
       }
    }


    async getTaskById(taskId:number,user:JwtPayloadData){
        try {   
            let task: Awaited<ReturnType<typeof this.taskRepository.findTaskById>>;
            if(user.role==="USER"){
                task = await this.taskRepository.findTaskById(taskId, {assignedId:user.id});                
                if (!task) {
                throw new BadRequestException("Task not found or you do not have permission")
                }
            } else {
                task = await this.taskRepository.findTaskById(taskId, {});
            }    
            return {message:"Task fetched successfully",data:task}
        } catch (error) {
            this.handleError(error,"SomeThing went wrong")
        }     
    }

    async getAllTasks(userId:number,userRole:string,queryPage:number,queryLimit:number){
        try {               
                const { skip, take, page, limit } = getPaginationParams(queryPage, queryLimit);
                const [data,total]=await Promise.all([
                    this.taskRepository.getAllTasks(userId, userRole,skip,take),
                    this.taskRepository.countTasks(userId, userRole)
                ])

                if (!data.length) {
                    throw new NotFoundException("No tasks found")
                }
                const messages = {
                    SUPER_ADMIN: 'All system tasks',
                    ADMIN: 'Admin tasks',
                    USER: 'User tasks',
                };
                const result=createPaginationResult(total, page, limit);                
                return { message: messages[userRole], data,metaData:result};
        } catch (error) {
            this.handleError(error)
        }

    }


    async updateStatus(taskId:number,user:JwtPayloadData,body:any){
            try {  
                    let task:any
                    if(user.role==="USER"){
                     task = await this.taskRepository.findTaskById(taskId, {assignedId:user.id});
                    }
                    if (!task) {
                        throw new BadRequestException("Task not found or you do not have permission")
                    }     
                    if(task.status===body.status){
                        throw new BadRequestException("Task is already in "+body.status+" state")
                    }
                    const updatedTask = await this.taskRepository.updateTask(taskId,{status:body.status});
                    
                    return {message:"Status updated successfully",data:updatedTask}
            } catch (error) {
                    this.handleError(error,"SomeThing Went Wrong")
            }
      
    }


    async assignUserTask(ids:AssignTaskDto){
        try {
            const{userId,taskId}=ids
            const task = await this.taskRepository.findTaskById(taskId);
                if (!task) {
                    throw new NotFoundException('Task not found');
                }
                console.log(task);
                const user=await  this.userRepository.findById(userId)
                console.log(user);
                
                
            // const project=await this.projectRepository.findProjectsByOwner(userId,ids.projectId)
            //     if (!project) {
            //         throw new NotFoundException('Project not found or you do not have permission',);
            //     }

                if(task.assignedId===userId){
                    throw new ConflictException('Task is already assigned to this User')
                }

            const updatedTask = await this.taskRepository.assignTaskToUser(taskId,userId);            

            return { message: 'Task assigned to User successfully', data: updatedTask };
        } catch (error) {
                this.handleError(error,"someThing went wrong")
        }   
    
    }



    private handleError(error: any, message: string="SomeThing Went Wrong") {
    if (error instanceof HttpException) {
      this.logger.warn(message, { error: error.message });
      throw error;
    }
    this.logger.error('INTERNAL_SERVER_ERROR', { error: error.message });
    throw new InternalServerErrorException('Something went wrong');
      }
}