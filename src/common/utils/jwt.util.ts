import { JwtService,JwtSignOptions  } from '@nestjs/jwt';



export const generateToken = (
    payload: object,
    jwtService: JwtService,
    options?: JwtSignOptions
): string => {
    return jwtService.sign(payload, options);
}

export const verifyToken =(token:string, jwtService: JwtService):object=>{
    try {
        return jwtService.verify(token)
    } catch (error) {
        throw new Error('Invalid token');
    }
}