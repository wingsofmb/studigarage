import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { GetProdileOutputDto } from 'src/topics/auth/dto/auth.dto';
import { UserService } from 'src/topics/user/user.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private jwtService: JwtService) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.fetchUsersByEmail(email);
    if (user?.saltedPassword !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  getProfile(req: Request): GetProdileOutputDto {
    const requestUser = req['user'];
    return {
      id: requestUser.sub,
      email: requestUser.email,
      role: requestUser.role,
    };
  }
}
