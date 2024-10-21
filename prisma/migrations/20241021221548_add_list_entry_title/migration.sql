/*
  Warnings:

  - Added the required column `title` to the `ListEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ListEntry" ADD COLUMN     "title" TEXT NOT NULL;
