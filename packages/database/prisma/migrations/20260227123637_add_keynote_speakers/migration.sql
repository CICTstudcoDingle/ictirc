-- CreateTable
CREATE TABLE "KeynoteSpeaker" (
    "id" TEXT NOT NULL,
    "conferenceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "position" TEXT NOT NULL,
    "affiliation" TEXT,
    "location" TEXT,
    "bio" TEXT,
    "photoUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KeynoteSpeaker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KeynoteSpeaker_conferenceId_idx" ON "KeynoteSpeaker"("conferenceId");

-- CreateIndex
CREATE INDEX "KeynoteSpeaker_displayOrder_idx" ON "KeynoteSpeaker"("displayOrder");

-- AddForeignKey
ALTER TABLE "KeynoteSpeaker" ADD CONSTRAINT "KeynoteSpeaker_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

