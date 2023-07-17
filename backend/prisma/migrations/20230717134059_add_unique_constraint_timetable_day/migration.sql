/*
  Warnings:

  - A unique constraint covering the columns `[day]` on the table `Timetable` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Timetable_day_key" ON "Timetable"("day");
