import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WarehouseService {
  constructor(private prisma: PrismaService) {}

  // 🏢 إنشاء مخزن جديد
  async createWarehouse(data: { 
    name: string; 
    location: string; 
    companyId?: number 
  }) {
    return this.prisma.warehouse.create({
      data: {
        name: data.name,
        location: data.location,
        companyId: data.companyId,
      },
    });
  }

  // 💊 إضافة دواء للمخزن
  async addMedicine(
    warehouseId: number,
    data: { 
      name: string; 
      price: number; 
      quantity: number; 
      activeIngredient?: string;
      expirationDate?: Date 
    },
  ) {
    return this.prisma.warehouseMedicine.create({
      data: {
        warehouseId,
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        activeIngredient: data.activeIngredient,
        expirationDate: data.expirationDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // 📦 تعديل كمية الدواء في المخزن
  async updateStock(warehouseId: number, medicineId: number, quantity: number) {
    const record = await this.prisma.warehouseMedicine.findFirst({
      where: { warehouseId, id: medicineId },
    });

    if (!record) throw new NotFoundException('Medicine not found in this warehouse');

    return this.prisma.warehouseMedicine.update({
      where: { id: record.id },
      data: { quantity },
    });
  }

  // 📋 عرض جميع الأدوية في المخزن
  async getMedicines(warehouseId: number) {
    return this.prisma.warehouseMedicine.findMany({
      where: { warehouseId },
    });
  }

  // 🧾 تفاصيل دواء معين في المخزن
  async getMedicineDetails(warehouseId: number, medicineId: number) {
    const record = await this.prisma.warehouseMedicine.findFirst({
      where: { warehouseId, id: medicineId },
    });

    if (!record) throw new NotFoundException('Medicine not found');
    return record;
  }

  // 📋 عرض طلبات المخزن
  async getWarehouseRequests(warehouseId: number) {
    return this.prisma.warehouseRequest.findMany({
      where: { warehouseId },
      include: { pharmacy: true },
    });
  }

  // ✅ تحديث حالة الطلب
  async updateRequestStatus(
    warehouseId: number, 
    requestId: number, 
    status: 'pending' | 'approved' | 'rejected' | 'delivered'
  ) {
    const request = await this.prisma.warehouseRequest.findFirst({
      where: { id: requestId, warehouseId },
    });

    if (!request) throw new NotFoundException('Request not found');

    return this.prisma.warehouseRequest.update({
      where: { id: requestId },
      data: { status },
    });
  }

  // 🏢 عرض جميع المخازن
  async getAllWarehouses() {
    return this.prisma.warehouse.findMany({
      include: { company: true },
    });
  }

  // 🏢 تفاصيل مخزن معين
  async getWarehouseDetails(warehouseId: number) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
      include: { company: true, medicines: true },
    });

    if (!warehouse) throw new NotFoundException('Warehouse not found');
    return warehouse;
  }
}
