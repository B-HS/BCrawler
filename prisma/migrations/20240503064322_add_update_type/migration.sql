-- CreateTable
CREATE TABLE `pm` (
    `pmid` VARCHAR(191) NOT NULL,
    `id` VARCHAR(191) NOT NULL,
    `is_closed` BOOLEAN NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `shipping` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `img_src` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`pmid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
