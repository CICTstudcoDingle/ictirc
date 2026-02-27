/**
 * Script to seed the 2026 2nd ICTIRC organizing committee members.
 *
 * Data source: apps/web/src/app/committees/page.tsx (hardcoded committee array)
 *
 * SAFE: Uses check-before-insert — will NOT wipe or overwrite existing records.
 *
 * Run with:
 *   pnpm tsx packages/database/scripts/seed-committee-2026.ts
 *
 * For production, ensure DATABASE_URL in your environment points to the production DB.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Full committee list as shown on the 2026 committees web page
const COMMITTEE_2026 = [
  { position: "Overall Chair",          name: "DR. RENANTE A. DIAMANTE",    displayOrder: 0 },
  { position: "Secretariat",            name: "TEDDY S. FUENTIVILLA, MIT",  displayOrder: 1 },
  { position: "Secretariat",            name: "ROWENA S. BORCELO, MPA",     displayOrder: 2 },
  { position: "Secretariat",            name: "JEZZA MAE V. CATIQUESTA",    displayOrder: 3 },
  { position: "Co-chair",               name: "DR. MUHAMMAD ALI FAUZI",     displayOrder: 4 },
  { position: "IT Chair",               name: "DR. GLENN C. TABIA",         displayOrder: 5 },
  { position: "IT Co-chair",            name: "REBIE L. DANITARAS, MIT",    displayOrder: 6 },
  { position: "Technical Chair",        name: "RENLY S. JADE LAUD, MIT",    displayOrder: 7 },
  { position: "Technical Co-Chair",     name: "RIC JOHN PUYING",            displayOrder: 8 },
  { position: "Research Facilitator",   name: "DR. GLENN DADOR",            displayOrder: 9 },
  { position: "Research Co-Facilitator",name: "SHAYLA BENDAÑA",             displayOrder: 10 },
  { position: "Publicity Chair",        name: "DR. BENJAMIN L. CORNELIO, JR.", displayOrder: 11 },
  { position: "Publicity Co-chair",     name: "JEFF EDRICK MARTINEZ",       displayOrder: 12 },
];

async function main() {
  console.log("🔍 Looking up the active 2026 conference...");

  // Prefer the currently active conference; fall back to any 2026 conference
  let conference = await prisma.conference.findFirst({
    where: { isActive: true },
  });

  if (!conference) {
    console.log("  No active conference found — searching by year 2026...");
    conference = await prisma.conference.findFirst({
      where: {
        startDate: {
          gte: new Date("2026-01-01"),
          lt:  new Date("2027-01-01"),
        },
      },
      orderBy: { startDate: "asc" },
    });
  }

  if (!conference) {
    console.error("❌ No 2026 conference found. Please create it in the admin panel first.");
    process.exit(1);
  }

  console.log(`✅ Found conference: "${conference.name}" (id: ${conference.id})`);
  console.log(`\n📋 Seeding ${COMMITTEE_2026.length} committee members...\n`);

  let created = 0;
  let skipped = 0;

  for (const member of COMMITTEE_2026) {
    // Check-before-insert: skip if (conferenceId + name + position) already exists
    const existing = await prisma.committeeMember.findFirst({
      where: {
        conferenceId: conference.id,
        name:         member.name,
        position:     member.position,
      },
    });

    if (existing) {
      console.log(`  ⏭  Skipped (already exists): [${member.position}] ${member.name}`);
      skipped++;
      continue;
    }

    await prisma.committeeMember.create({
      data: {
        conferenceId: conference.id,
        name:         member.name,
        position:     member.position,
        displayOrder: member.displayOrder,
      },
    });

    console.log(`  ✅ Created: [${member.position}] ${member.name}`);
    created++;
  }

  console.log(`\n🎉 Done! Created: ${created}, Skipped: ${skipped}`);
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
