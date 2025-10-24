import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  // 🏢 إنشاء شركة جديدة
  async createCompany(data: { 
    name: string; 
    email?: string; 
    phone?: string 
  }) {
    return this.prisma.company.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    });
  }

  // 📋 عرض جميع الشركات
  async getAllCompanies() {
    return this.prisma.company.findMany({
      include: { warehouses: true },
    });
  }

  // 🏢 تفاصيل شركة معينة
  async getCompanyDetails(companyId: number) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: { warehouses: true },
    });

    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  // 🏢 تحديث بيانات الشركة
  async updateCompany(
    companyId: number,
    data: { name?: string; email?: string; phone?: string }
  ) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) throw new NotFoundException('Company not found');

    return this.prisma.company.update({
      where: { id: companyId },
      data,
    });
  }

  // 🗑️ حذف شركة
  async deleteCompany(companyId: number) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) throw new NotFoundException('Company not found');

    return this.prisma.company.delete({
      where: { id: companyId },
    });
  }

  // 🏢 عرض مخازن الشركة
  async getCompanyWarehouses(companyId: number) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: { warehouses: true },
    });

    if (!company) throw new NotFoundException('Company not found');
    return company.warehouses;
  }
}
