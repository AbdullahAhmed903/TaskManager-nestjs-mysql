import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaModule } from 'prisma/prisma.module';
import { DashboardRepository } from './dashboardRepository';

@Module({
  imports:[PrismaModule],
  controllers: [DashboardController],
  providers: [DashboardService,DashboardRepository]
})
export class DashboardModule {}
