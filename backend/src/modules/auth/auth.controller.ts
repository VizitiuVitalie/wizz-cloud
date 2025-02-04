import {
  Controller,
  Post,
  Body,
  Inject,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { AuthServiceInterface } from './interfaces/auth.service.interface';
import { JwtGuard } from '../../shared/jwt/jwt.guard';
import { VerifyEmailDto } from 'src/libs/email-verification/verify-email.dto';
import { AuthTokens } from 'src/shared/types/auth-tokens.type';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthServiceInterface,
  ) {}

  @Post('register')
  public async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  public async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  public async refresh(@Headers('authorization') authHeader: string) {
    const refreshToken = authHeader.replace('Bearer ', '');
    return this.authService.refreshSession(refreshToken);
  }

  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<AuthTokens> {
    console.log('successfully verified email');
    return this.authService.verifyEmail(dto);
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  public async logout(@Headers('authorization') authHeader: string) {
    const accessToken = authHeader.replace('Bearer ', '');
    await this.authService.logout(accessToken);
    return { message: 'Logged out successfully' };
  }
}
