import { BadRequestException, HttpException, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ProjectRepository } from './project.respository';
import { UpdateProjectDto } from './dto/updateProjectDto';
import { JwtPayloadData } from 'src/common/interfaces/jwt-payload.interface';

@Injectable()
export class ProjectService {
    constructor(private projectRepo:ProjectRepository,@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger){}



    async createProject(data:any,user:any){
        try {
            const {id:userId}=user
            const projectExist=await this.projectRepo.uniqueProjectName(data.name,userId) 

            if(projectExist){                
                throw new BadRequestException("This Name Of Project Already Exist")
            }
            const project=await this.projectRepo.createProject({
                ...data,
                ownerId:userId
            })            
            return {message:"Project created Successfully",data:project}
        } catch (error) {
            this.logger.error("create Project Error", error)
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException("Something went wrong")
        }
        
        
    }


    async updateProject(data:UpdateProjectDto,user:JwtPayloadData,projectId:number){
        try {
                const {id:userId}=user
                const projectOwner=await this.projectRepo.findProjectsByOwner(userId,projectId)
                if(!projectOwner){
                    throw new UnauthorizedException("Project not found OR you are not allowed to perform this action")
                }
                if(data.name && data.name !== projectOwner.name){
                    const projectExist=await this.projectRepo.uniqueProjectName(data.name, userId,projectId)
                    if(projectExist){
                        throw new BadRequestException("This Name Of Project Already Exist")
                    }
                }                
                const project=await this.projectRepo.updateProject(projectId,data)
                return {message:"Project Updated Successfully", data:project}

        } catch (error) {
                  this.logger.error("Update Project Error", {error:error.message,stack: error.stack})
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException("Something went wrong")
        }
    }
}
