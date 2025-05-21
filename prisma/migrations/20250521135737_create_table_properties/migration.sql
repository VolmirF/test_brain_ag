-- CreateTable
CREATE TABLE "properties" (
    "id" SERIAL NOT NULL,
    "producer_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "farm_area" DECIMAL(65,30) NOT NULL,
    "arable_area" DECIMAL(65,30) NOT NULL,
    "vegetation_area" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_producer_id_fkey" FOREIGN KEY ("producer_id") REFERENCES "producers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
