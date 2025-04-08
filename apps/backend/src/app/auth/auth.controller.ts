// apps/backend/src/auth/auth.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() credentials: { email: string, password: string, name?: string }) {
    const token = await this.authService.login(credentials);
    if (!token) {
      throw new HttpException('Eroare la autentificare', HttpStatus.UNAUTHORIZED);
    }
    return { token };
  }
}
