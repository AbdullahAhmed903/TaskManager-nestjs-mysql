import {Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";



@Injectable()
export class  ProjectRepository {
    constructor(private prisma:PrismaService){}

    async createProject(data:any){
        return this.prisma.project.create({
            data
        })
    }

    async uniqueProjectName(name:string,id:number,excludeId?: number){
        return this.prisma.project.findFirst({
            where:{
                name,
                ownerId:id,
                ...(excludeId&& { NOT: { id: excludeId } })
            }
        })
    }

    async findProjectsByOwner(id:number,projectId:number){
        return this.prisma.project.findFirst({
            where:{
                ownerId:id,
                id:projectId
            },
            select:
                {
                    id:true,
                    name:true,
                }
        })
    }

    async updateProject(id:number, data:any){
        return this.prisma.project.update({
            where:{id},
            data
        })
    }
}