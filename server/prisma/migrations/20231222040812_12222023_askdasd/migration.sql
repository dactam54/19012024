-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
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
CREATE TABLE `hoa_don` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maHoaDon` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `hoaDonXuatId` INTEGER NULL,
    `hoaDonNhapId` INTEGER NULL,
    `quantity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `hoa_don_maHoaDon_key`(`maHoaDon`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hoa_don_nhap` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maHoaDon` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `hoa_don_nhap_maHoaDon_key`(`maHoaDon`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hoa_don_xuat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maHoaDon` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `hoa_don_xuat_maHoaDon_key`(`maHoaDon`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hoa_don` ADD CONSTRAINT `hoa_don_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hoa_don` ADD CONSTRAINT `hoa_don_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hoa_don` ADD CONSTRAINT `hoa_don_hoaDonXuatId_fkey` FOREIGN KEY (`hoaDonXuatId`) REFERENCES `hoa_don_xuat`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hoa_don` ADD CONSTRAINT `hoa_don_hoaDonNhapId_fkey` FOREIGN KEY (`hoaDonNhapId`) REFERENCES `hoa_don_nhap`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
