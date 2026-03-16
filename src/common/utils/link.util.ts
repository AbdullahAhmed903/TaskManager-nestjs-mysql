import { Request } from "express";



export const buildVerificationLink=(req:Request,token:string,route:string):string=>{
    const baseUrl = `${req.protocol}://${req.headers.host}`;

    return `${baseUrl}/${route}/${token}`;
}