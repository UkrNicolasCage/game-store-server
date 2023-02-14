import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsInt()
  @Max(100)
  @Min(7)
  readonly age: number;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  readonly password: string;
}

export class SigninDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  readonly password: string;
}
