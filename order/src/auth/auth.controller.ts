import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() userDto: UserDto) {
    return this.authService.register(userDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() userDto: UserDto) {
    return this.authService.login(userDto);
  }
}
