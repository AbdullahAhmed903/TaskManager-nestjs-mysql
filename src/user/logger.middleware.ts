import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";



@Injectable()

export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger){}
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.originalUrl}`);
    console.log('Request...');
    const start = Date.now()
      res.on('finish', () => {
        const duration = Date.now() - start
        this.logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`)
    })
    next();
  }
}