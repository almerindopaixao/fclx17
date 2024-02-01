import { IsNotEmpty, MaxLength } from 'class-validator';

export class UserDto {
  @MaxLength(255)
  @IsNotEmpty()
  username: string;

  @MaxLength(255)
  @IsNotEmpty()
  password: string;
}
