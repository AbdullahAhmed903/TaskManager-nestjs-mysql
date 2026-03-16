import { Body, Controller, Get, Header, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query, Req, Res, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import type { Request, Response } from 'express';
import { CreateUserDto } from './dto/createUserDto';
import { LoginDto } from './dto/loginUserDto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UnverifiedUserFilter } from 'src/common/filters/unverified-user.filter';
import { ClearCookieInterceptor, RefreshTokenCookieInterceptor } from 'src/common/interceptors/refresh-token-cookie.interceptor';
import { SendVerificationEmailInterceptor } from 'src/common/interceptors/send-verification-email.interceptor';
import { RefreshTokenGuard } from 'src/auth/guards/refresh-token.guard';


@ApiTags("auth")
@ApiBearerAuth()
@Controller('auth')
export class UserController {
  constructor(private userService:UserService){}

  //.....................signup...........................//
  @ApiOperation({summary:"signUp"})
  @ApiResponse({status:201,description:"user created sucess"})
  @ApiResponse({status:409,description:"email already exist",type:"error"})
  @Post("signup")
  @UseInterceptors(SendVerificationEmailInterceptor)
  signUp(@Body() createUser: CreateUserDto){
      return this.userService.signup(createUser)
  }


  //.....................login...........................//
  @ApiOperation({summary:"login"})
  @ApiResponse({status:200, description:"user logged in sucess"})
  @ApiResponse({status:401, description:"invalid credentials", type:"error"})
  @ApiResponse({status:404, description:"user not found", type:"error"})
  @ApiResponse({status:500, description:"internal server error", type:"error"})
  @Post("login")
  @UseFilters(UnverifiedUserFilter)
  @UseInterceptors(RefreshTokenCookieInterceptor)
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUser: LoginDto){
    return this.userService.login(loginUser)    

  }

  //.....................verify emai...........................//
  @ApiOperation({summary:"verify email"})
  @ApiResponse({status:200, description:"Email verified successfully"})
  @ApiResponse({status:400, description:"invalid token", type:"error"})
  @ApiResponse({status:500, description:"internal server error", type:"error"})
  @Get("verify-email/:token")
  @HttpCode(HttpStatus.OK)
  verifyEmail(@Param('token') token: string) {
    return this.userService.verifyEmail(token)
  }


  @ApiOperation({summary:"logout"})
  @ApiResponse({status:200, description:"user logged out sucess"})
  @ApiResponse({status:401, description:"unauthorized", type:"error"})
  @HttpCode(HttpStatus.OK)
  @Post("logout")
  @UseInterceptors(ClearCookieInterceptor)
  async logout(){
    return this.userService.logOut()
  }


  @ApiOperation({summary:"refreshtoken"})
  @ApiResponse({status:200, description:"token refreshed"})
  @ApiResponse({status:401, description:"unauthorized", type:"error"})
  @Post("refresh-token")
  @UseGuards(RefreshTokenGuard)
  @UseInterceptors(RefreshTokenCookieInterceptor)
  async refreshToken(@Req() req: Request){     
    return this.userService.refreshToken(req.user)
  }


  //   @Post("query")
  //  testquery(@Query()query:any){
  //   console.log(query);
  // }

}




