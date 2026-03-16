import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";





@Injectable()
export class TaskRepository {
    constructor(private prisma:PrismaService){}

    async uniqueTaskName(name:string,id:number,excludeId?: number){
        return this.prisma.task.findFirst({
            where:{
                title:name,
                createdById:id,
                ...(excludeId && { NOT: { id: excludeId } })
            },
            select:{
                id:true
            }
        })
    }
    
    async createTask(data:any){
        return this.prisma.task.create({
            data
        })
    }

    async taskAuthrization(id:number,createdById:number){
        return this.prisma.task.findFirst({
            where:{id,createdById}
        })
    }


    async updateTask(id:number,data:any){
        return this.prisma.task.update({
            where:{id},
            data
        })
    }

    async deleteTask(taskId:number,createdById:number){
        return this.prisma.task.delete({
            where:{id:taskId,createdById}
        })
    }

    async findTaskById(taskId:number,filters?:Partial<{assignedId:number}>){
        return this.prisma.task.findUnique({
            where:{id:taskId,...filters}
        })
    }

    async assignTaskToUser(taskId:number, userId:number){
        return this.prisma.task.update({
            where:{id:taskId},
            data:{
                assignedId:userId
            }
        })
    }

    async getAllTasks(userId:number,userRole:string,skip:number,take:number){
        const where= userRole==='SUPER_ADMIN' ? {} : userRole==="ADMIN"
        ?{ OR: [{ createdById: userId }, { project: { ownerId: userId } }] } 
        :{ OR: [{ createdById: userId }, { assignedId: userId }] };

        return this.prisma.task.findMany({
            where,
              include: {
                createdBy: { select: { id: true, userName: true } },
                assignedTo: { select: { id: true, userName: true } },
                project: { select: { id: true, name: true } },
                },
                skip,
                take,
                
        })
    }

    async countTasks(userId:number, userRole:string){
        const where= userRole==='SUPER_ADMIN' ? {} : userRole==="ADMIN"
        ?{ OR: [{ createdById: userId }, { project: { ownerId: userId } }] }
        :{ OR: [{ createdById: userId }, { assignedId: userId }] };

        return this.prisma.task.count({
            where
        })
    }
}