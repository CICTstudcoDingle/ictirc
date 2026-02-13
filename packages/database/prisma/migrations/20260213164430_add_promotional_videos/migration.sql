-- CreateEnum
CREATE TYPE "VideoType" AS ENUM ('PROMOTIONAL', 'TEASER');

-- CreateTable
CREATE TABLE "PromotionalVideo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "VideoType" NOT NULL,
    "r2Key" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "editorName" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromotionalVideo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PromotionalVideo_type_idx" ON "PromotionalVideo"("type");

-- CreateIndex
CREATE INDEX "PromotionalVideo_isPublished_idx" ON "PromotionalVideo"("isPublished");

-- CreateIndex
CREATE INDEX "PromotionalVideo_uploadDate_idx" ON "PromotionalVideo"("uploadDate");
