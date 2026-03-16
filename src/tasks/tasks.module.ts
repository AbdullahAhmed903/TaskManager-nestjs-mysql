import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TaskService } from './task.service';
import { PrismaModule } from 'prisma/prisma.module';
import { TaskRepository } from './task.repository';
import { ProjectRepository } from 'src/project/project.respository';
import { UserRepository } from 'src/user/user.repository';

@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [TaskService,TaskRepository,ProjectRepository,UserRepository],
})
export class TasksModule {}
