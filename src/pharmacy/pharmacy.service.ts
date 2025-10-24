import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PharmacyService {
  constructor(private prisma: PrismaService) {}

  // 🧾 إضافة دواء جديد للصيدلية
  async addMedicine(
    pharmacyId: number,
    data: { 
      name: string; 
      price: number; 
      quantity: number; 
      activeIngredient?: string;
      expirationDate?: Date | string;
    },
  ) {
    const pharmacy = await this.prisma.pharmacy.findUnique({ where: { id: pharmacyId } });
    if (!pharmacy) throw new NotFoundException(`Pharmacy with ID ${pharmacyId} not found`);

    return this.prisma.pharmacyMedicine.create({
      data: {
        pharmacyId,
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        activeIngredient: data.activeIngredient,
        expirationDate: data.expirationDate
          ? new Date(data.expirationDate)
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // 📦 تعديل كمية الدواء في المخزون
  async updateStock(pharmacyId: number, medicineId: number, quantity: number) {
    const result = await this.prisma.pharmacyMedicine.updateMany({
      where: { id: medicineId, pharmacyId },
      data: { quantity },
    });
    if (result.count === 0)
      throw new NotFoundException('Medicine not found in this pharmacy');
    return { message: 'Stock updated successfully' };
  }

  // 📋 عرض جميع الأدوية المتاحة في صيدلية معينة
  async getMedicines(pharmacyId: number) {
    return this.prisma.pharmacyMedicine.findMany({
      where: { pharmacyId },
      select: {
        id: true,
        name: true,
        price: true,
        quantity: true,
        expirationDate: true,
        activeIngredient: true,
      },
    });
  }

  // 🧾 تفاصيل دواء معين
  async getMedicineDetails(pharmacyId: number, medicineId: number) {
    const record = await this.prisma.pharmacyMedicine.findFirst({
      where: { pharmacyId, id: medicineId },
    });

    if (!record) throw new NotFoundException('Medicine not found');
    return record;
  }

  // 🏥 إنشاء طلب من المخزن
  async createWarehouseRequest(
    pharmacyId: number,
    data: { warehouseId: number; medicineName: string; quantity: number }
  ) {
    return this.prisma.warehouseRequest.create({
      data: {
        pharmacyId,
        warehouseId: data.warehouseId,
        medicineName: data.medicineName,
        quantity: data.quantity,
        status: 'pending',
      },
    });
  }

  // 📋 عرض طلبات الصيدلية من المخازن
  async getWarehouseRequests(pharmacyId: number) {
    return this.prisma.warehouseRequest.findMany({
      where: { pharmacyId },
      include: { warehouse: true },
    });
  }
}
