import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";




@Injectable()
export class UserRepository{
    constructor(private prisma: PrismaService){}
     async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

    async createUser(email: string,userName:string,hashedPassword:string) {
    return this.prisma.user.create({
        data:{
          userName:userName,
          email:email,
          password:hashedPassword
         }
    });
  }

    async updateUser(id: number, data: Partial<{ isVerified: boolean }>) {
    return this.prisma.user.update({ where: { id }, data });
  }


  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
    
}