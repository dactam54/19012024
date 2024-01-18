/*
  Warnings:

  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `hoa_don` DROP FOREIGN KEY `hoa_don_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `hoa_don` DROP FOREIGN KEY `hoa_don_productId_fkey`;

-- DropTable
DROP TABLE `products`;

-- DropTable
DROP TABLE `users`;
