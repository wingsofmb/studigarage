-- CreateEnum
CREATE TYPE "EnergyType" AS ENUM ('DIESEL', 'PETROL', 'ELECTRIC', 'HYBRID');

-- CreateEnum
CREATE TYPE "GearBoxType" AS ENUM ('MANUAL', 'AUTOMATIC');

-- CreateEnum
CREATE TYPE "OptionTheme" AS ENUM ('INSIDE', 'OUTSIDE', 'SAFETY', 'OTHER');

-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "firstCirculationDate" TIMESTAMP(3) NOT NULL,
    "mileage" INTEGER NOT NULL,
    "energy" "EnergyType" NOT NULL,
    "gearbox" "GearBoxType" NOT NULL,
    "insideColor" TEXT NOT NULL,
    "outsideColor" TEXT NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarOptions" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "theme" "OptionTheme" NOT NULL,
    "carId" INTEGER NOT NULL,

    CONSTRAINT "CarOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carPicture" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "carId" INTEGER NOT NULL,

    CONSTRAINT "carPicture_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CarOptions" ADD CONSTRAINT "CarOptions_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carPicture" ADD CONSTRAINT "carPicture_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
