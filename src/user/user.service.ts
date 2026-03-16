import {BadRequestException, Body, ConflictException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException, Param, UnauthorizedException} from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { JwtService } from "@nestjs/jwt";
import { generateToken, verifyToken } from "src/common/utils/jwt.util";
import { comparePassword, hashPassword } from "src/common/utils/hash.util";
import { UserRepository } from "./user.repository";
import { UnverifiedUserException } from "src/common/exceptions/unverified-user.exception";





@Injectable()

export class UserService{
   constructor(private userRepository: UserRepository,@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,private  jwtService: JwtService){}


   async signup(@Body() body:any){
      try {
         const existingUser = await this.userRepository.findByEmail(body.email)
      if(existingUser){
        throw new ConflictException("Email Already Exist")
      }
         const hashedPassword =await hashPassword(body.password)
         const newUser=await this.userRepository.createUser(
            body.email,
            body.userName,
            hashedPassword
      )
         const token=generateToken({ id: newUser.id }, this.jwtService);
         this.logger.info('User created successfully', { email: body.email });
         return {message:'User registered successfully. Please check your email.',data:{user:newUser,token}};
      } catch (error) {
         this.handleError(error, 'User registration failed');
      }          
   }



   async login(@Body() body:any){
      try {
      const existingUser=await this.validateUser(body.email, body.password);
         const checkVerified=existingUser.isVerified
         if(!checkVerified){
            await this.checkVerification(existingUser)
         }
         const { accessToken,refreshToken } = await this.generateTokens(existingUser);
         return {message:'Login successful',data:{accessToken,refreshToken}}
      } catch (error) {
         this.handleError(error, 'Login failed');
      }
      
   }

      private async validateUser(email: string, password: string) {
         const user = await this.userRepository.findByEmail(email);
         if (!user) {
            throw new NotFoundException('User not found');
         }
         const isPasswordValid = await comparePassword(password, user.password);
         if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
         }
         return user;
      }

      private async checkVerification(user: any) {
         const token=generateToken({ id: user.id }, this.jwtService);              
         this.logger.warn('Email not verified', { email: user.email });
         throw new UnverifiedUserException(user,token)
      }

      private async generateTokens(user: any) {
         const payload = { id: user.id, role: user.role };
         const accessToken = generateToken(payload, this.jwtService);
         const refreshToken = generateToken(payload, this.jwtService, { expiresIn: '7d' });
         return { accessToken, refreshToken };
      }

      private handleError(error: any, message: string) {
    if (error instanceof HttpException) {
      this.logger.warn(message, { error: error.message });
      throw error;
    }
    this.logger.error('INTERNAL_SERVER_ERROR', { error: error.message });
    throw new InternalServerErrorException('Something went wrong');
      }




   async verifyEmail(@Param() token:string){
      try {
         const decoded=verifyToken(token, this.jwtService) as { id: number };
         const userId = decoded.id;
         if(!userId){
            throw new BadRequestException('Invalid token')
         }
         await this.userRepository.updateUser(userId, { isVerified: true });
            return { message: 'Email verified successfully' ,data:null};
         
      } catch (error) {
         this.logger.error("Email verification failed", { error: error.message });
         throw new InternalServerErrorException('Something went wrong')
      }
      
   }


   async logOut(){
      try {
      return {message:'Logged out successfully',data:null}
      } catch (error) {
         this.logger.error("INTERNAL_SERVER_ERROR", { error: error.message });
         throw new InternalServerErrorException('Something went wrong')
      }
       
   }


   async refreshToken(user:any){
   const result = await this.userRepository.findById(user.id);
  if (!result) throw new UnauthorizedException('User not found');
         
  const { accessToken, refreshToken } = await this.generateTokens(user);

  return {
    message: 'Token refreshed successfully',
    data: { accessToken, refreshToken },
  };
   }

}


