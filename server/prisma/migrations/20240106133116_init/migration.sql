/*
  Warnings:

  - You are about to alter the column `customerId` on the `hoa_don` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `status` on the `hoa_don_xuat` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.

*/
-- DropIndex
DROP INDEX `hoa_don_customerId_fkey` ON `hoa_don`;

-- DropIndex
DROP INDEX `hoa_don_productId_fkey` ON `hoa_don`;

-- AlterTable
ALTER TABLE `hoa_don` MODIFY `customerId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `hoa_don_nhap` ADD COLUMN `date` DATETIME(3) NULL,
    ADD COLUMN `shipper` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('pending', 'success', 'cancel') NOT NULL DEFAULT 'pending',
    ADD COLUMN `user` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `hoa_don_xuat` ADD COLUMN `date` DATETIME(3) NULL,
    ADD COLUMN `shipper` VARCHAR(191) NULL,
    ADD COLUMN `user` VARCHAR(191) NULL,
    MODIFY `status` ENUM('pending', 'success', 'cancel') NOT NULL DEFAULT 'pending';

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `cart` JSON NULL,
    `address` VARCHAR(191) NULL,
    `wishlist` JSON NULL,
    `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    `phone` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `thumb` VARCHAR(191) NULL,
    `spec_thumb` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `policy` JSON NULL,
    `detail` JSON NULL,
    `images` JSON NULL,
    `overviews` JSON NULL,
    `catalog` VARCHAR(191) NOT NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `catalogslug` VARCHAR(191) NOT NULL,
    `discount` INTEGER NULL,
    `quantity` INTEGER NOT NULL,
    `star` INTEGER NOT NULL,
    `desc` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `the_kho` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maHoaDon` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `type` ENUM('nhap', 'xuat') NOT NULL DEFAULT 'nhap',
    `status` ENUM('pending', 'success', 'cancel') NOT NULL DEFAULT 'pending',
    `date` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `the_kho_maHoaDon_key`(`maHoaDon`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hoa_don` ADD CONSTRAINT `hoa_don_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hoa_don` ADD CONSTRAINT `hoa_don_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `the_kho` ADD CONSTRAINT `the_kho_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
