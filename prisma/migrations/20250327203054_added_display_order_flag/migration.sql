-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT true;
