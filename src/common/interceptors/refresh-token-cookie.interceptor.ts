import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()

export class RefreshTokenCookieInterceptor  implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>{
        
        return next.handle().pipe(
            map(result => {
                const res = context.switchToHttp().getResponse();                
                const refreshToken = result?.data?.refreshToken;                
                 if (refreshToken) {
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                    });
                        delete result.data.refreshToken;                                
                    return { ...result, data: result.data };
                    }
                    return result
            })
        )

    }
}



export class ClearCookieInterceptor  implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>{
                 const res = context.switchToHttp().getResponse();
                const req = context.switchToHttp().getRequest();                
                const refreshToken = req.cookies['refreshToken'];
                if(!refreshToken){
                     throw new BadRequestException('You are not logged in');
                }
        return next.handle().pipe(
            map(result => {
           
                   res.clearCookie('refreshToken',{
                        httpOnly: true,   
                            secure: false,    
                            sameSite: 'lax',
                    });

                    return result
            })
        )

    }
}