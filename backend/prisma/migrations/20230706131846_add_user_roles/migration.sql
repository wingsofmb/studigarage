-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PUBLIC', 'EMPLOYEE', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'EMPLOYEE';
