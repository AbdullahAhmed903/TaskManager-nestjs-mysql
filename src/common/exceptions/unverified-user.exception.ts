import { HttpException, HttpStatus } from "@nestjs/common";

export class UnverifiedUserException extends HttpException {
  constructor(public readonly user: any, public readonly token:string) {
    super('Email not verified', HttpStatus.FORBIDDEN);
  }
}