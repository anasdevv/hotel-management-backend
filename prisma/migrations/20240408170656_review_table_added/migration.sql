/*
  Warnings:

  - The primary key for the `Booking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Feature` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FoodItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `OrderItems` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Room` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- DropForeignKey
ALTER TABLE "Feature" DROP CONSTRAINT "Feature_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_foodItemId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_orderItemsId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "roomId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Booking_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Booking_id_seq";

-- AlterTable
ALTER TABLE "Feature" DROP CONSTRAINT "Feature_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "roomId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Feature_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Feature_id_seq";

-- AlterTable
ALTER TABLE "FoodItem" DROP CONSTRAINT "FoodItem_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FoodItem_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FoodItem_id_seq";

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "foodItemId" SET DATA TYPE TEXT,
ALTER COLUMN "orderItemsId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Order_id_seq";

-- AlterTable
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "OrderItems_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "OrderItems_id_seq";

-- AlterTable
ALTER TABLE "Room" DROP CONSTRAINT "Room_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Room_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Room_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "userId" TEXT,
    "roomId" TEXT,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "FoodItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_orderItemsId_fkey" FOREIGN KEY ("orderItemsId") REFERENCES "OrderItems"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
