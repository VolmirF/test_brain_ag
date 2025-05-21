-- CreateTable
CREATE TABLE "plantings" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "crop_id" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "area" DECIMAL(65,30) NOT NULL,
    "yeld" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plantings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "plantings" ADD CONSTRAINT "plantings_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plantings" ADD CONSTRAINT "plantings_crop_id_fkey" FOREIGN KEY ("crop_id") REFERENCES "crops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
