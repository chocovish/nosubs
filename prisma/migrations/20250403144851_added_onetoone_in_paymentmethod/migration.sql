/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `PaymentMethod` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `details` on the `PaymentMethod` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PaymentMethod" DROP COLUMN "details",
ADD COLUMN     "details" JSONB NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_userId_key" ON "PaymentMethod"("userId");
