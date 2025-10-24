import { Controller, Post, Get, Param, Body, Patch } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';

@Controller('pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  // 🧾 إضافة دواء جديد
  @Post(':pharmacyId/add-medicine')
  addMedicine(
    @Param('pharmacyId') pharmacyId: string,
    @Body() body: { 
      name: string; 
      price: number; 
      quantity: number; 
      activeIngredient?: string;
      expirationDate?: Date 
    },
  ) {
    return this.pharmacyService.addMedicine(Number(pharmacyId), body);
  }

  // 📦 تعديل كمية الدواء
  @Patch(':pharmacyId/update-stock/:medicineId')
  updateStock(
    @Param('pharmacyId') pharmacyId: string,
    @Param('medicineId') medicineId: string,
    @Body() body: { quantity: number },
  ) {
    return this.pharmacyService.updateStock(
      Number(pharmacyId),
      Number(medicineId),
      body.quantity,
    );
  }

  // 📋 كل الأدوية في الصيدلية
  @Get(':pharmacyId/medicines')
  getMedicines(@Param('pharmacyId') pharmacyId: string) {
    return this.pharmacyService.getMedicines(Number(pharmacyId));
  }

  // 🧾 تفاصيل دواء واحد
  @Get(':pharmacyId/medicine/:medicineId')
  getMedicineDetails(
    @Param('pharmacyId') pharmacyId: string,
    @Param('medicineId') medicineId: string,
  ) {
    return this.pharmacyService.getMedicineDetails(
      Number(pharmacyId),
      Number(medicineId),
    );
  }

  // 🏥 إنشاء طلب من المخزن
  @Post(':pharmacyId/warehouse-request')
  createWarehouseRequest(
    @Param('pharmacyId') pharmacyId: string,
    @Body() body: { warehouseId: number; medicineName: string; quantity: number }
  ) {
    return this.pharmacyService.createWarehouseRequest(Number(pharmacyId), body);
  }

  // 📋 عرض طلبات الصيدلية من المخازن
  @Get(':pharmacyId/warehouse-requests')
  getWarehouseRequests(@Param('pharmacyId') pharmacyId: string) {
    return this.pharmacyService.getWarehouseRequests(Number(pharmacyId));
  }
}
