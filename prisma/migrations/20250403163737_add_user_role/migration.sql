-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_id_key" ON "roles"("id");
