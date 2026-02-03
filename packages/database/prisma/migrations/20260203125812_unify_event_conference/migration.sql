/*
  Warnings:

  - You are about to drop the column `date` on the `Conference` table. All the data in the column will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `startDate` to the `Conference` table without a default value. This is not possible if the table is not empty.

*/

-- First, add the new columns without NOT NULL constraints
ALTER TABLE "Conference" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "Conference" ADD COLUMN IF NOT EXISTS "endDate" TIMESTAMP(3);
ALTER TABLE "Conference" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE "Conference" ADD COLUMN IF NOT EXISTS "isPublished" BOOLEAN DEFAULT true;
ALTER TABLE "Conference" ADD COLUMN IF NOT EXISTS "startDate" TIMESTAMP(3);

-- Migrate existing date to startDate for existing conferences
UPDATE "Conference" SET "startDate" = "date" WHERE "startDate" IS NULL;

-- Now make startDate NOT NULL
ALTER TABLE "Conference" ALTER COLUMN "startDate" SET NOT NULL;
ALTER TABLE "Conference" ALTER COLUMN "isPublished" SET NOT NULL;

-- Drop the old date column
ALTER TABLE "Conference" DROP COLUMN IF EXISTS "date";

-- Migrate existing Event data to Conference (if Event table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Event') THEN
    INSERT INTO "Conference" (id, name, "fullName", "startDate", "endDate", location, description, "imageUrl", "isPublished", "createdAt", "updatedAt")
    SELECT 
      id,
      title as name,
      title as "fullName",
      "startDate",
      "endDate",
      location,
      description,
      "imageUrl",
      "isPublished",
      "createdAt",
      "updatedAt"
    FROM "Event"
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Drop Event table
DROP TABLE IF EXISTS "Event";

-- Drop old index and create new ones
DROP INDEX IF EXISTS "Conference_date_idx";
CREATE INDEX IF NOT EXISTS "Conference_startDate_idx" ON "Conference"("startDate");
CREATE INDEX IF NOT EXISTS "Conference_isPublished_idx" ON "Conference"("isPublished");
