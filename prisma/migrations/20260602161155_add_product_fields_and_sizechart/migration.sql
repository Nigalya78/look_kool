-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "fitType" TEXT,
ADD COLUMN     "hasSizeChart" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "occasion" TEXT,
ADD COLUMN     "sleeveType" TEXT,
ADD COLUMN     "washCare" TEXT;

-- CreateTable
CREATE TABLE "SizeChart" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "bust" DOUBLE PRECISION,
    "waist" DOUBLE PRECISION,
    "hip" DOUBLE PRECISION,
    "length" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SizeChart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SizeChart_productId_idx" ON "SizeChart"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "SizeChart_productId_size_key" ON "SizeChart"("productId", "size");

-- AddForeignKey
ALTER TABLE "SizeChart" ADD CONSTRAINT "SizeChart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
