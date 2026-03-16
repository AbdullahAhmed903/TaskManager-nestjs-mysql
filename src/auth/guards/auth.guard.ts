import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;      
      if (!authHeader) {
        throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
      }
      const token = authHeader.split('bedo__')[1];
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET
      });
      if (!decodedToken) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      request['user'] = decodedToken;
      return true;
    } catch (error) {
       if (error.name === "TokenExpiredError") {
          throw new HttpException("Token expired. Please log in again.", HttpStatus.UNAUTHORIZED);
          }
        throw new HttpException(error, HttpStatus.UNAUTHORIZED);
    }
  }

}
