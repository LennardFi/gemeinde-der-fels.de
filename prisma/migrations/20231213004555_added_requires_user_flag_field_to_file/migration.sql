/*
  Warnings:

  - You are about to drop the column `AdminFlag` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ManageCalendarFlag` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ManageNewsFlag` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ManageRoomsFlag` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ManageSermonsFlag` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ManageUserFlag` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserFlags" AS ENUM ('Admin', 'ManageCalendar', 'ManageNews', 'ManageSermons', 'ManageRooms', 'ManageUser');

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "requiresUserFlag" "UserFlags";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "AdminFlag",
DROP COLUMN "ManageCalendarFlag",
DROP COLUMN "ManageNewsFlag",
DROP COLUMN "ManageRoomsFlag",
DROP COLUMN "ManageSermonsFlag",
DROP COLUMN "ManageUserFlag",
ADD COLUMN     "Flag_Admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "Flag_ManageCalendar" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "Flag_ManageNews" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "Flag_ManageRooms" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "Flag_ManageSermons" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "Flag_ManageUser" BOOLEAN NOT NULL DEFAULT false;
