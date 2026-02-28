-- CreateEnum: PlagiarismStatus
CREATE TYPE "PlagiarismStatus" AS ENUM ('PENDING', 'PASS', 'FLAGGED', 'REJECTED', 'OVERRIDDEN');

-- AlterTable: Add plagiarism fields to Paper
ALTER TABLE "Paper" ADD COLUMN "plagiarismScore" DOUBLE PRECISION;
ALTER TABLE "Paper" ADD COLUMN "plagiarismStatus" "PlagiarismStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "Paper" ADD COLUMN "plagiarismCheckedAt" TIMESTAMP(3);
ALTER TABLE "Paper" ADD COLUMN "plagiarismCheckedBy" TEXT;
ALTER TABLE "Paper" ADD COLUMN "plagiarismNotes" TEXT;
ALTER TABLE "Paper" ADD COLUMN "plagiarismOverriddenBy" TEXT;
ALTER TABLE "Paper" ADD COLUMN "plagiarismOverrideNote" TEXT;

-- CreateIndex: Index on plagiarismStatus for filtering
CREATE INDEX "Paper_plagiarismStatus_idx" ON "Paper"("plagiarismStatus");

-- AddForeignKey: Link plagiarismCheckedBy to User
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_plagiarismCheckedBy_fkey" FOREIGN KEY ("plagiarismCheckedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
