import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('server run on port 5000');
  app.useGlobalPipes(new ValidationPipe({
  whitelist: true,             // 👈 strips extra fields automatically
  forbidNonWhitelisted: true,  // 👈 throws error if extra fields are sent
}));
  app.use(helmet({contentSecurityPolicy: false}))
  app.use(cookieParser());

      const config = new DocumentBuilder()
        .setTitle('Task Management API')
        .setDescription('API documentation for Task Management')
        .setVersion('1.0')
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'Authorization',
            in: 'header'
          },
          'access-token'
        ) // for JWT
        .setBasePath('/api/v1')
        .addServer('http://localhost:5000/api/v1')
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, document)
     app.setGlobalPrefix(`${process.env.BASE_URL}`); 
     app.useGlobalFilters(new HttpExceptionFilter())
     app.useGlobalInterceptors(new TransformInterceptor())
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
