import { createTransporter } from "src/config/nodemailer.config";


interface EmailData {
    link:string,
    email:string,
    name:string
}

export const sendVerificationEmail  = async (
    dest:string,
    data:EmailData,
    attachments?:any
): Promise<void> => {
        // send mail with defined transport object
        const html= `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 20px auto; border: 1px solid #dddddd; padding: 20px;">
                
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px; font-size: 14px;">
                    <tr>
                        <td style="padding-bottom: 5px;"><strong>From:</strong> ${process.env.NODE_MAILER_EMAIL}</td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 20px;"><strong>To:</strong> ${data.email}</td>
                    </tr>
                </table>
    
                <h2 style="color: #1a73e8; border-bottom: 2px solid #eeeeee; padding-bottom: 10px;">Account Registration Complete</h2>
    
                <p>Dear <strong>${data.name}</strong>,</p>
    
                <p>
                    Thank you for registering with us! You have successfully completed the initial sign-up process.
                </p>
    
                <p>
                    To secure your account and access all features, please click the confirmation button below:
                </p>
    
                <table width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="padding: 20px 0; text-align: center;">
                            <a href="${data.link}" target="_blank" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                Confirm My Account
                            </a>
                        </td>
                    </tr>
                </table>
    
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 15px; font-size: 14px;">
                    <tr>
                        <td>
                            <p>Best Regards,</p>
                            <p>The Team Name : Abdullah Ahmed</p>
                        </td>
                    </tr>
                </table>
            </div>
        `;
        const info = await createTransporter().sendMail({
        from: `${process.env.nodeMailerEmail}`, // sender address
        to: dest, // list of receivers
        subject: "Weclome To our website", // Subject line
        html, // html body
        attachments,
    });
    console.log("Message sent: %s", info.messageId);
};