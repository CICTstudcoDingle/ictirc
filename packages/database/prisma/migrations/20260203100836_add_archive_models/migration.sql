-- AlterTable
ALTER TABLE "Paper" ADD COLUMN     "publicationNote" TEXT,
ADD COLUMN     "publicationStep" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "ResearchGuide" ADD COLUMN     "guideCategoryId" TEXT;

-- CreateTable
CREATE TABLE "ResearchGuideCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchGuideCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Volume" (
    "id" TEXT NOT NULL,
    "volumeNumber" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "description" TEXT,
    "coverImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Volume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" TEXT NOT NULL,
    "issueNumber" INTEGER NOT NULL,
    "month" TEXT,
    "publishedDate" TIMESTAMP(3) NOT NULL,
    "issn" TEXT,
    "theme" TEXT,
    "description" TEXT,
    "coverImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "volumeId" TEXT NOT NULL,
    "conferenceId" TEXT,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conference" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "venue" TEXT,
    "theme" TEXT,
    "organizers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "partners" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchivedPaper" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "keywords" TEXT[],
    "doi" TEXT,
    "pdfUrl" TEXT NOT NULL,
    "docxUrl" TEXT,
    "pageStart" INTEGER,
    "pageEnd" INTEGER,
    "publishedDate" TIMESTAMP(3) NOT NULL,
    "submittedDate" TIMESTAMP(3),
    "acceptedDate" TIMESTAMP(3),
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,

    CONSTRAINT "ArchivedPaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchivedPaperAuthor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "affiliation" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isCorresponding" BOOLEAN NOT NULL DEFAULT false,
    "paperId" TEXT NOT NULL,

    CONSTRAINT "ArchivedPaperAuthor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResearchGuideCategory_name_key" ON "ResearchGuideCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchGuideCategory_slug_key" ON "ResearchGuideCategory"("slug");

-- CreateIndex
CREATE INDEX "ResearchGuideCategory_slug_idx" ON "ResearchGuideCategory"("slug");

-- CreateIndex
CREATE INDEX "Volume_year_idx" ON "Volume"("year");

-- CreateIndex
CREATE INDEX "Volume_volumeNumber_idx" ON "Volume"("volumeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Volume_volumeNumber_year_key" ON "Volume"("volumeNumber", "year");

-- CreateIndex
CREATE INDEX "Issue_volumeId_idx" ON "Issue"("volumeId");

-- CreateIndex
CREATE INDEX "Issue_conferenceId_idx" ON "Issue"("conferenceId");

-- CreateIndex
CREATE INDEX "Issue_publishedDate_idx" ON "Issue"("publishedDate");

-- CreateIndex
CREATE UNIQUE INDEX "Issue_volumeId_issueNumber_key" ON "Issue"("volumeId", "issueNumber");

-- CreateIndex
CREATE INDEX "Conference_date_idx" ON "Conference"("date");

-- CreateIndex
CREATE UNIQUE INDEX "ArchivedPaper_doi_key" ON "ArchivedPaper"("doi");

-- CreateIndex
CREATE INDEX "ArchivedPaper_issueId_idx" ON "ArchivedPaper"("issueId");

-- CreateIndex
CREATE INDEX "ArchivedPaper_categoryId_idx" ON "ArchivedPaper"("categoryId");

-- CreateIndex
CREATE INDEX "ArchivedPaper_publishedDate_idx" ON "ArchivedPaper"("publishedDate");

-- CreateIndex
CREATE INDEX "ArchivedPaper_uploadedAt_idx" ON "ArchivedPaper"("uploadedAt");

-- CreateIndex
CREATE INDEX "ArchivedPaperAuthor_paperId_idx" ON "ArchivedPaperAuthor"("paperId");

-- CreateIndex
CREATE INDEX "ArchivedPaperAuthor_email_idx" ON "ArchivedPaperAuthor"("email");

-- CreateIndex
CREATE INDEX "ResearchGuide_guideCategoryId_idx" ON "ResearchGuide"("guideCategoryId");

-- AddForeignKey
ALTER TABLE "ResearchGuide" ADD CONSTRAINT "ResearchGuide_guideCategoryId_fkey" FOREIGN KEY ("guideCategoryId") REFERENCES "ResearchGuideCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_volumeId_fkey" FOREIGN KEY ("volumeId") REFERENCES "Volume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivedPaper" ADD CONSTRAINT "ArchivedPaper_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivedPaper" ADD CONSTRAINT "ArchivedPaper_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivedPaper" ADD CONSTRAINT "ArchivedPaper_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivedPaperAuthor" ADD CONSTRAINT "ArchivedPaperAuthor_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "ArchivedPaper"("id") ON DELETE CASCADE ON UPDATE CASCADE;
