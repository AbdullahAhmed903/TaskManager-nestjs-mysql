import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { UnverifiedUserException } from "../exceptions/unverified-user.exception";
import { sendVerificationEmail } from "../utils/nodemailer.util";
import { buildVerificationLink } from "../utils/link.util";




@Catch(UnverifiedUserException)
export class UnverifiedUserFilter implements ExceptionFilter {
    constructor() {}
        async catch(exception: any, host: ArgumentsHost) {
            const ctx = host.switchToHttp();
            const res = ctx.getResponse();
             const req = ctx.getRequest();
                const email:string = exception.user.email;
                const name:string=exception.user.name
                const token:string=exception.token
                const link = buildVerificationLink(req,token,`${process.env.EMAIL_BASEURL}`) as string;
                
                    sendVerificationEmail(email,{link,email,name});

                res.status(HttpStatus.FORBIDDEN).json({
                success: false,
                message: 'Account not verified. Verification email sent.',
                });
        }
}