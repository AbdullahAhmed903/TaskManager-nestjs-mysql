import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";


@Catch(HttpException)

export class HttpExceptionFilter implements ExceptionFilter{
    catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;


     res.status(statusCode).json({
      success: false,
      message: exceptionResponse.message || exception.message,
      errors: exceptionResponse.errors || null,
    });
    }
}