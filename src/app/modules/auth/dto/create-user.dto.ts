import { IsOptional, IsString, IsDefined, IsEmail } from 'class-validator';

export default class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  password: string;
}
