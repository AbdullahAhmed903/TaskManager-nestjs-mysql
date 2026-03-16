import { Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiAcceptedResponse, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('dashboard')
@UseGuards(AuthGuard,RolesGuard)
@Roles(["SUPER_ADMIN"])
@ApiTags('dashboard') 
@ApiBearerAuth('access-token')
@ApiAcceptedResponse({description:'only super admin can access this route'})
export class DashboardController {
    constructor(private dashboardService:DashboardService){}


    @ApiOperation({ summary: 'Get All Users' })
    @ApiResponse({ status: 200, description: 'Users return successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @Get('users')
    getAllUsers() {
    return this.dashboardService.getAllUsers();
    }


    @ApiOperation({ summary: 'Promote User To Admin' })
    @ApiResponse({ status: 200, description: 'User promoted to admin successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 409, description: 'User already admin' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @Patch('users/:id/promote')
    promoteUser(@Param('id',ParseIntPipe) id: string) {
    return this.dashboardService.promoteUser(+id);
    }


    @ApiOperation({ summary: 'Demote Admin To User' })
    @ApiResponse({ status: 200, description: 'User demoted successfully' })
    @ApiResponse({ status: 400, description: 'Cannot demote a regular user Or Cannot demote super admin' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @Patch('users/:id/demote')
    demoteUser(@Param('id',ParseIntPipe) id: string) {
    return this.dashboardService.demoteUser(+id);
    }


    @ApiOperation({ summary: 'Delete User' })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @Delete('users/:id')
    deleteUser(@Param('id',ParseIntPipe) id: string) {
    return this.dashboardService.deleteUser(+id);
  }


}
