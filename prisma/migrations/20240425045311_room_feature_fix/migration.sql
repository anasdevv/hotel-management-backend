/*
  Warnings:

  - You are about to drop the column `roomId` on the `Feature` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Feature" DROP CONSTRAINT "Feature_roomId_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Feature" DROP COLUMN "roomId";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "_FeatureToRoom" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FeatureToRoom_AB_unique" ON "_FeatureToRoom"("A", "B");

-- CreateIndex
CREATE INDEX "_FeatureToRoom_B_index" ON "_FeatureToRoom"("B");

-- AddForeignKey
ALTER TABLE "_FeatureToRoom" ADD CONSTRAINT "_FeatureToRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeatureToRoom" ADD CONSTRAINT "_FeatureToRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
