
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("1. Connecting to database...");
  try {
    // Test basic query
    const count = await prisma.paper.count();
    console.log(`✅ Connected! Paper count: ${count}`);
  } catch (e) {
    console.error("❌ Basic query failed:", e);
    process.exit(1);
  }

  console.log("2. Testing Soundex extension...");
  try {
    // Test soundex
    const result = await prisma.$queryRaw`SELECT soundex('Hello') as s`;
    console.log(`✅ Soundex working! Result:`, result);
  } catch (e) {
    console.error("❌ Soundex query failed (Extension 'fuzzystrmatch' might be missing):", e);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
