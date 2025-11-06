/*
  Warnings:

  - You are about to drop the column `age` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `contactNumber` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "patients" DROP COLUMN "age",
DROP COLUMN "contactNumber",
DROP COLUMN "gender",
ALTER COLUMN "address" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "name";
