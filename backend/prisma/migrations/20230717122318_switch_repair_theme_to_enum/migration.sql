/*
  Warnings:

  - Changed the type of `theme` on the `RepairService` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ServiceTheme" AS ENUM ('REPAIR_MAINTENANCE', 'REVIEW', 'DIAGNOSTIC', 'CAR_BODY_AND_PAINTING', 'ADMIN', 'OTHER');

-- AlterTable
ALTER TABLE "RepairService" DROP COLUMN "theme",
ADD COLUMN     "theme" "ServiceTheme" NOT NULL;
