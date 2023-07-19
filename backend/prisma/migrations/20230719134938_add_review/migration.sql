-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'REJECTED', 'VALIDATED');

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "status" "ReviewStatus" NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);
