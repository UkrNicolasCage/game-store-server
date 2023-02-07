import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiExeption extends HttpException {
  constructor(status: HttpStatus, message: string) {
    super(message, status);
  }

  static BadRequest(arg0: string, arg1: string) {
    return new ApiExeption(
      HttpStatus.BAD_REQUEST,
      'User is not found',
    );
  }

  static UnauthorizedError() {
    return new ApiExeption(
      HttpStatus.UNAUTHORIZED,
      'User is not authorized',
    );
  }
}
