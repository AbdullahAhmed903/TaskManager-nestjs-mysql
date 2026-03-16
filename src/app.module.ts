import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './user/logger.middleware';
import { PrismaModule } from 'prisma/prisma.module';
import { winstonConfig } from './config/winston.config';
import { JwtModule } from '@nestjs/jwt';
import { TasksModule } from './tasks/tasks.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ProjectModule } from './project/project.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true,envFilePath: '.env' }), UserModule,TasksModule,ProjectModule,PrismaModule,winstonConfig,JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1h' },
  }),
  ThrottlerModule.forRoot({
    throttlers:[
      {
        ttl:60000,
        limit:10
      }
    ]
  }),
  DashboardModule,

],
  controllers: [AppController],
  providers: [AppService,{
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }],
})
export class AppModule  implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('auth','tasks',"project");
  }
}
