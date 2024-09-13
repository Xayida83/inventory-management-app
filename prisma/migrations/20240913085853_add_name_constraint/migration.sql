/*
  Warnings:

  - You are about to alter the column `name` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);
