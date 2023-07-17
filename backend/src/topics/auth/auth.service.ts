import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { GetProdileOutputDto } from 'src/topics/auth/dto/auth.dto';
import { PasswordService } from 'src/topics/auth/password.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, private jwtService: JwtService, private passwordService: PasswordService) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException();

    const isPasswordValid = await this.passwordService.validatePassword(pass, user.saltedPassword);
    if (!isPasswordValid) throw new UnauthorizedException();

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
