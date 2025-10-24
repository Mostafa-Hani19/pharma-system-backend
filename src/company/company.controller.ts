import { Controller, Post, Get, Param, Body, Patch, Delete } from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // 🏢 إنشاء شركة جديدة
  @Post()
  createCompany(
    @Body() body: { name: string; email?: string; phone?: string }
  ) {
    return this.companyService.createCompany(body);
  }

  // 📋 عرض جميع الشركات
  @Get()
  getAllCompanies() {
    return this.companyService.getAllCompanies();
  }

  // 🏢 تفاصيل شركة معينة
  @Get(':companyId')
  getCompanyDetails(@Param('companyId') companyId: string) {
    return this.companyService.getCompanyDetails(Number(companyId));
  }

  // 🏢 تحديث بيانات الشركة
  @Patch(':companyId')
  updateCompany(
    @Param('companyId') companyId: string,
    @Body() body: { name?: string; email?: string; phone?: string }
  ) {
    return this.companyService.updateCompany(Number(companyId), body);
  }

  // 🗑️ حذف شركة
  @Delete(':companyId')
  deleteCompany(@Param('companyId') companyId: string) {
    return this.companyService.deleteCompany(Number(companyId));
  }

  // 🏢 عرض مخازن الشركة
  @Get(':companyId/warehouses')
  getCompanyWarehouses(@Param('companyId') companyId: string) {
    return this.companyService.getCompanyWarehouses(Number(companyId));
  }
}
