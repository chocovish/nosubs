-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_buyerId_fkey";

-- AlterTable
ALTER TABLE "Sale" ALTER COLUMN "buyerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
