-- AlterTable
ALTER TABLE "Dietas" ADD COLUMN     "doctorId" TEXT;

-- AddForeignKey
ALTER TABLE "Dietas" ADD CONSTRAINT "Dietas_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
