import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable, tap } from "rxjs";
import { sendVerificationEmail } from "../utils/nodemailer.util";
import { buildVerificationLink } from "../utils/link.util";

@Injectable()
export class SendVerificationEmailInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
       const req = context.switchToHttp().getRequest();
    return next.handle().pipe(
      tap(async result => {
        const { user, token } = result?.data;
        if (!user || !token) return;
        const link = buildVerificationLink(req,token,`${process.env.EMAIL_BASEURL}`)
        await sendVerificationEmail(user.email, { link, email: user.email, name: user.userName });
      }),
      map(result => {
        // strip sensitive data before sending response
        const { token, user, ...safeData } = result.data;
        return { ...result, data: safeData };
      })
    );
  }
}