import { Body, Controller, Get, Request, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiValidationPipe } from 'src/common/pipes/api-validation.pipe';
import { AuthService } from 'src/topics/auth/auth.service';
import { SignInDto } from 'src/topics/auth/dto/auth.dto';
import { PublicApi } from 'src/topics/auth/decorators/public-api.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @PublicApi()
  public async signIn(@Body(new ApiValidationPipe()) signInDto: SignInDto): Promise<{ access_token: string }> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Get('me')
  public async me(@Request() req) {
    return this.authService.getProfile(req);
  }
}
