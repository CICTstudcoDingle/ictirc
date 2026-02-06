-- CreateEnum
CREATE TYPE "ReleaseType" AS ENUM ('MAJOR', 'MINOR', 'PATCH', 'BETA', 'ALPHA');

-- CreateEnum
CREATE TYPE "ChangeType" AS ENUM ('FEATURE', 'ENHANCEMENT', 'BUGFIX', 'SECURITY', 'BREAKING', 'DEPRECATED');

-- AlterTable
ALTER TABLE "PaperAuthor" ADD COLUMN     "isCorrespondingAuthor" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Release" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "versionType" "ReleaseType" NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "gitCommitHash" TEXT,
    "gitTag" TEXT,
    "githubReleaseId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isBeta" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "Release_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangelogEntry" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "changeType" "ChangeType" NOT NULL,
    "prNumber" INTEGER,
    "prUrl" TEXT,
    "issueNumber" INTEGER,
    "issueUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "releaseId" TEXT NOT NULL,

    CONSTRAINT "ChangelogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Release_version_key" ON "Release"("version");

-- CreateIndex
CREATE UNIQUE INDEX "Release_githubReleaseId_key" ON "Release"("githubReleaseId");

-- CreateIndex
CREATE INDEX "Release_releaseDate_idx" ON "Release"("releaseDate");

-- CreateIndex
CREATE INDEX "Release_isPublished_idx" ON "Release"("isPublished");

-- CreateIndex
CREATE INDEX "Release_version_idx" ON "Release"("version");

-- CreateIndex
CREATE INDEX "ChangelogEntry_releaseId_idx" ON "ChangelogEntry"("releaseId");

-- CreateIndex
CREATE INDEX "ChangelogEntry_changeType_idx" ON "ChangelogEntry"("changeType");

-- CreateIndex
CREATE INDEX "ChangelogEntry_order_idx" ON "ChangelogEntry"("order");

-- CreateIndex
CREATE INDEX "PaperAuthor_isCorrespondingAuthor_idx" ON "PaperAuthor"("isCorrespondingAuthor");

-- AddForeignKey
ALTER TABLE "Release" ADD CONSTRAINT "Release_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangelogEntry" ADD CONSTRAINT "ChangelogEntry_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE CASCADE ON UPDATE CASCADE;
