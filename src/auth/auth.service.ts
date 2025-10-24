import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 🧾 تسجيل مستخدم جديد (مريض)
  async registerUser(data: { name: string; email: string; password: string }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) throw new BadRequestException('Email already registered');

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: { name: data.name, email: data.email, password: hashed },
    });

    return { message: 'User registered successfully', user };
  }

  // 🏥 تسجيل صيدلية جديدة
  async registerPharmacy(data: { name: string; address: string; email: string; password: string }) {
    const existing = await this.prisma.pharmacy.findUnique({
      where: { email: data.email },
    });
    if (existing) throw new BadRequestException('Email already registered');

    const hashed = await bcrypt.hash(data.password, 10);

    const pharmacy = await this.prisma.pharmacy.create({
      data: { name: data.name, address: data.address, email: data.email, password: hashed },
    });

    return { message: 'Pharmacy registered successfully', pharmacy };
  }

  // 🔑 تسجيل الدخول
  async login(data: { email: string; password: string }) {
    const user =
      (await this.prisma.user.findUnique({ where: { email: data.email } })) ||
      (await this.prisma.pharmacy.findUnique({ where: { email: data.email } }));

    if (!user) throw new BadRequestException('Invalid email or password');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid email or password');

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: 'pharmacy' in user ? 'pharmacy' : 'user',
    });

    return { access_token: token };
  }
}
