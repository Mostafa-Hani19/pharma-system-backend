import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 🧾 تسجيل مستخدم جديد
  @Post('register-user')
  registerUser(@Body() body: { name: string; email: string; password: string }) {
    return this.authService.registerUser(body);
  }

  // 🏥 تسجيل صيدلية جديدة
  @Post('register-pharmacy')
  registerPharmacy(@Body() body: { name: string; address: string; email: string; password: string }) {
    return this.authService.registerPharmacy(body);
  }

  // 🔑 تسجيل الدخول
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }
}
