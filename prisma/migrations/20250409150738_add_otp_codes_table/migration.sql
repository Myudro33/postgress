/*
  Warnings:

  - You are about to drop the column `otpCode` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpiry` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "otpCode",
DROP COLUMN "otpExpiry";

-- CreateTable
CREATE TABLE "otpCodes" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "expiry" TIMESTAMP(6) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "otpCodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "otpCodes_id_key" ON "otpCodes"("id");

-- AddForeignKey
ALTER TABLE "otpCodes" ADD CONSTRAINT "otpCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
