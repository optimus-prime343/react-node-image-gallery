/*
  Warnings:

  - You are about to drop the column `description` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Image` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "description",
DROP COLUMN "title";
