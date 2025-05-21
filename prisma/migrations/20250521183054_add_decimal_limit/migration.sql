/*
  Warnings:

  - You are about to alter the column `area` on the `plantings` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `yeld` on the `plantings` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `farm_area` on the `properties` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `arable_area` on the `properties` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `vegetation_area` on the `properties` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "plantings" ALTER COLUMN "area" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "yeld" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "properties" ALTER COLUMN "farm_area" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "arable_area" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "vegetation_area" SET DATA TYPE DECIMAL(10,2);
