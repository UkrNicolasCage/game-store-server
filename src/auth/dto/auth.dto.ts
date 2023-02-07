import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsInt()
  @Max(99)
  @Min(9)
  readonly age: number;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  readonly password: string;
}
