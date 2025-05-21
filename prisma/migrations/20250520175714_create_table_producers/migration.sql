-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('CPF', 'CNPJ');

-- CreateTable
CREATE TABLE "producers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "document_type" "DocumentType" NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "producers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "producers_document_key" ON "producers"("document");
