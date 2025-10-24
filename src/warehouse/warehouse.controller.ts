import { Controller, Post, Get, Param, Body, Patch } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  // 🏢 إنشاء مخزن جديد
  @Post()
  createWarehouse(
    @Body() body: { name: string; location: string; companyId?: number }
  ) {
    return this.warehouseService.createWarehouse(body);
  }

  // 💊 إضافة دواء للمخزن
  @Post(':warehouseId/add-medicine')
  addMedicine(
    @Param('warehouseId') warehouseId: string,
    @Body() body: { 
      name: string; 
      price: number; 
      quantity: number; 
      activeIngredient?: string;
      expirationDate?: Date 
    },
  ) {
    return this.warehouseService.addMedicine(Number(warehouseId), body);
  }

  // 📦 تعديل كمية الدواء
  @Patch(':warehouseId/update-stock/:medicineId')
  updateStock(
    @Param('warehouseId') warehouseId: string,
    @Param('medicineId') medicineId: string,
    @Body() body: { quantity: number },
  ) {
    return this.warehouseService.updateStock(
      Number(warehouseId),
      Number(medicineId),
      body.quantity,
    );
  }

  // 📋 كل الأدوية في المخزن
  @Get(':warehouseId/medicines')
  getMedicines(@Param('warehouseId') warehouseId: string) {
    return this.warehouseService.getMedicines(Number(warehouseId));
  }

  // 🧾 تفاصيل دواء واحد
  @Get(':warehouseId/medicine/:medicineId')
  getMedicineDetails(
    @Param('warehouseId') warehouseId: string,
    @Param('medicineId') medicineId: string,
  ) {
    return this.warehouseService.getMedicineDetails(
      Number(warehouseId),
      Number(medicineId),
    );
  }

  // 📋 عرض طلبات المخزن
  @Get(':warehouseId/requests')
  getWarehouseRequests(@Param('warehouseId') warehouseId: string) {
    return this.warehouseService.getWarehouseRequests(Number(warehouseId));
  }

  // ✅ تحديث حالة الطلب
  @Patch(':warehouseId/request/:requestId/status')
  updateRequestStatus(
    @Param('warehouseId') warehouseId: string,
    @Param('requestId') requestId: string,
    @Body() body: { status: 'pending' | 'approved' | 'rejected' | 'delivered' }
  ) {
    return this.warehouseService.updateRequestStatus(
      Number(warehouseId),
      Number(requestId),
      body.status,
    );
  }

  // 🏢 عرض جميع المخازن
  @Get()
  getAllWarehouses() {
    return this.warehouseService.getAllWarehouses();
  }

  // 🏢 تفاصيل مخزن معين
  @Get(':warehouseId')
  getWarehouseDetails(@Param('warehouseId') warehouseId: string) {
    return this.warehouseService.getWarehouseDetails(Number(warehouseId));
  }
}
