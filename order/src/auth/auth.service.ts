import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async login({ username, password }: UserDto) {
    const findUser = await this.userRepository.findOneBy({
      username,
    });

    if (!findUser) {
      throw new UnauthorizedException(`Usúario não existe.`);
    }

    if (!User.verify(password, findUser.password)) {
      throw new UnauthorizedException(`Senha incorreta.`);
    }

    const payload = { sub: findUser.id, username };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(userDto: UserDto) {
    const username = userDto.username;
    const findUser = await this.userRepository.findOneBy({
      username,
    });

    if (findUser)
      throw new BadRequestException(`Usúario ${username} ja existe.`);

    const user = User.create(userDto);
    await this.userRepository.save(user);
  }
}
