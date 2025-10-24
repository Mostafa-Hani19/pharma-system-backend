-- DropForeignKey
ALTER TABLE "public"."Medicine" DROP CONSTRAINT "Medicine_warehouseId_fkey";

-- AlterTable
ALTER TABLE "Medicine" ALTER COLUMN "warehouseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Medicine" ADD CONSTRAINT "Medicine_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;
