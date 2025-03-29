/*
  Warnings:

  - The primary key for the `usersProducts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `usersProducts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "usersProducts" DROP CONSTRAINT "usersProducts_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "usersProducts_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "usersProducts_id_key" ON "usersProducts"("id");
