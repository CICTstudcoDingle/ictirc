/**
 * Script to add changelog entries for February 2026 updates
 * Run this with: pnpm tsx packages/database/scripts/add-feb-2026-changelog.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Adding February 2026 changelog entries...");

  // Get admin user (or create a system user for automated entries)
  const adminUser = await prisma.user.findFirst({
    where: {
      role: "ADMIN",
    },
  });

  if (!adminUser) {
    console.error("No admin user found. Please create an admin user first.");
    process.exit(1);
  }

  // Create release for v1.2.0
  const release = await prisma.release.upsert({
    where: { version: "1.2.0" },
    update: {},
    create: {
      version: "1.2.0",
      versionType: "MINOR",
      title: "2026 Conference Updates & Organization Pages",
      description: "Added comprehensive conference information, organizing committee details, and sponsor pages for the 2026 IRCICT conference.",
      releaseDate: new Date("2026-02-06"),
      isPublished: true,
      isBeta: false,
      createdBy: adminUser.id,
    },
  });

  console.log(`Created/Updated release: ${release.version}`);

  // Add changelog entries
  const entries = [
    {
      title: "Added HOME page with 2026 IRCICT conference highlights",
      description:
        "Created a dedicated /home page featuring comprehensive event details for the 2026 2nd International Research Conference in Information Communications Technology. Includes conference dates (March 3-4, 2026), hybrid format information, venue details at Knowledge Hub Center ISUFST-Dingle Campus, organizer information (CICT and University of Brawijaya), RASUC endorsement badge, and call-to-action sections for research submission.",
      changeType: "FEATURE" as const,
      order: 1,
    },
    {
      title: "Added Organizing Committee page",
      description:
        "Created /committees page displaying the complete 2026 organizing committee structure including Overall Chair (Dr. Renante A. Diamante), Secretariat team, IT leadership, Technical chairs, Research facilitators, and Publicity team. Includes official contact email (irjict@gmail.com).",
      changeType: "FEATURE" as const,
      order: 2,
    },
    {
      title: "Added Sponsors & Partners page",
      description:
        "Created /sponsors page showcasing conference organizers and partners including CICT ISUFST-Dingle Campus as primary organizer, University of Brawijaya Indonesia as major partner, and supporting organizations (International Linkages Affairs Office, R&D, RASUC). Includes sponsor inquiry call-to-action.",
      changeType: "FEATURE" as const,
      order: 3,
    },
    {
      title: "Updated navigation with ORGANIZATION dropdown menu",
      description:
        "Enhanced desktop navigation with new ORGANIZATION dropdown containing links to Committees and Sponsors pages. Added HOME link as first navigation item. Implemented hover-based dropdown with smooth animations and proper z-indexing.",
      changeType: "ENHANCEMENT" as const,
      order: 4,
    },
    {
      title: "Updated mobile navigation menu",
      description:
        "Redesigned mobile navigation to include HOME link, Committees, and Sponsors as dedicated menu items. Added appropriate icons (Users for Committees, Award for Sponsors) and updated active state logic to support the new /home route.",
      changeType: "ENHANCEMENT" as const,
      order: 5,
    },
    {
      title: "Fixed R2 connection configuration",
      description:
        "Resolved R2 bucket connection issues by removing incorrect quotes from R2_BUCKET_NAME_COLD environment variable across all .env files (admin, author, web, database). Updated default bucket name from 'cict-cold-storage' to 'ictirc' and corrected .env.example files.",
      changeType: "BUGFIX" as const,
      order: 6,
    },
  ];

  for (const entry of entries) {
    const created = await prisma.changelogEntry.create({
      data: {
        ...entry,
        releaseId: release.id,
      },
    });
    console.log(`✓ Added entry: ${created.title}`);
  }

  console.log("\n✅ Successfully added changelog entries for February 2026 updates!");
  console.log(`Release: ${release.version} - ${release.title}`);
  console.log(`Total entries: ${entries.length}`);
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
