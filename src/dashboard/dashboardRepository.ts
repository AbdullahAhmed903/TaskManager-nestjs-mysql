import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";




@Injectable()
export class DashboardRepository {
    constructor(private prisma: PrismaService){}

        async getAllUsers(){
            return await this.prisma.user.findMany({
                  select: {
                id: true,
                userName: true,
                email: true,
                role: true,
                isVerified: true,
                createdAt: true,
            },
            })
        }

        async findUserById(id:number){
            
            return await this.prisma.user.findUnique({
                where: {
                    id:id
                },
                select: {
                    id: true,
                    userName: true,
                    email: true,
                    role: true,
                    isVerified: true,
                    createdAt: true,
                },
            })

        }

        async updateUserRole(id:number, role:any){
            return await this.prisma.user.update({
                where: {
                    id:id
                },
                data: {
                    role:role
                }
            })
        }

        async deleteUser(id:number){
            return await this.prisma.user.delete({
                where: {
                    id:id
                }
            })
        }
}