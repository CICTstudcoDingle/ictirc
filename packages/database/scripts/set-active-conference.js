// Quick script to set an existing conference as active
const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();
  
  try {
    // Find all conferences
    const conferences = await prisma.conference.findMany();
    console.log("Found", conferences.length, "conferences:");
    conferences.forEach(c => console.log(`  - ${c.id}: ${c.name} (isActive: ${c.isActive})`));

    if (conferences.length > 0) {
      // Set the first one as active
      const result = await prisma.conference.update({
        where: { id: conferences[0].id },
        data: { isActive: true },
      });
      console.log("\nSet as active:", result.name);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
