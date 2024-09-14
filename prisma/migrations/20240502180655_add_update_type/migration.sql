/*
  Warnings:

  - Added the required column `type` to the `lastupdate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `lastupdate` ADD COLUMN `type` ENUM('QS', 'FM') NOT NULL;
