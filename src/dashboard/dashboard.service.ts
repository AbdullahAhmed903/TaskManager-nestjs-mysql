import { BadRequestException, ConflictException, HttpException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DashboardRepository } from './dashboardRepository';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class DashboardService {
    constructor(private dashboardRepository:DashboardRepository,@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger ){}


    async getAllUsers(){
        try {
            const users = await this.dashboardRepository.getAllUsers();
            return { message: 'Users fetched successfully', data:users };
        } catch (error) {
            this.handleError(error)
        }   
    }


    async promoteUser(userId: number){
        try {
                const user=await this.dashboardRepository.findUserById(userId)
                if(!user){    
                    throw new BadRequestException('User not found')
                }
               if (user?.role === 'ADMIN') {
                throw new ConflictException('User is already an admin')
                }
                if (user?.role === 'SUPER_ADMIN') {
                throw new BadRequestException('Cannot promote super admin')
                }
             const updatedUser = await this.dashboardRepository.updateUserRole(userId, 'ADMIN');
            return { message: 'User promoted to admin successfully', user: updatedUser };
        } catch (error) {
            this.handleError(error)
        }
      }


    async demoteUser(userId: number) {
        try {
                const user = await this.dashboardRepository.findUserById(userId);
                if (!user) {
                throw new BadRequestException('User not found');
                }
                if (user?.role === 'USER') {
                throw new BadRequestException('Cannot demote a regular user');
                }
                if (user?.role === 'SUPER_ADMIN') {
                throw new BadRequestException('Cannot demote super admin');
                }

                const updatedUser = await this.dashboardRepository.updateUserRole(userId, 'USER');
                return { message: 'User demoted successfully', user: updatedUser };
        } catch (error) {
            this.handleError(error)
        }

  }

  async deleteUser(userId: number) {
        try {
            const user = await this.dashboardRepository.findUserById(userId);
            if (!user) {
                throw new BadRequestException('User not found');
            }
            if (user?.role === 'SUPER_ADMIN') {
                throw new BadRequestException('Cannot delete super admin');
            }
            await this.dashboardRepository.deleteUser(userId);
            return { message: 'User deleted successfully' };
        } catch (error) {
            this.handleError(error)
        }
    }


      private handleError(error: any, message: string="someThing went wrong") {
        if (error instanceof HttpException) {
          this.logger.warn(message, { error: error.message });
          throw error;
        }
        this.logger.error('INTERNAL_SERVER_ERROR', { error: error.message });
        throw new InternalServerErrorException('Something went wrong');
          }
}
