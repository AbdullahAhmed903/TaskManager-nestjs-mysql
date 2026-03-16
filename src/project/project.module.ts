import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { ProjectRepository } from './project.respository';

@Module({
  imports:[PrismaModule],
  providers: [ProjectService,ProjectRepository],
  controllers: [ProjectController]
})
export class ProjectModule {}
