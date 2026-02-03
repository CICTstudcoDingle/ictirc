import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // 1. Clear existing categories
  console.log("🧹 Clearing existing categories...");
  await prisma.category.deleteMany({});

  // 2. Define Hierarchy
  const hierarchy = [
    {
      name: "Information and Communications Technology",
      slug: "ict",
      description: "Broad field covering all aspects of managing and processing information.",
      children: [
        { name: "AI and Robotics", slug: "ai-robotics" },
        { name: "Web and Mobile", slug: "web-mobile" },
        { name: "Software Development", slug: "software-dev" },
        { name: "Computer Networking", slug: "networking" },
        { name: "Information Systems", slug: "info-systems" },
        { name: "Other related technological studies", slug: "other-tech" },
      ]
    },
    {
      name: "Computer Science and Engineering",
      slug: "cse",
      description: "Theoretical and practical approach to computation and its applications.",
      children: [
        { name: "Electronics & Communications Engineering", slug: "ece" },
        { name: "Mathematics", slug: "math" },
      ]
    },
    {
      name: "Industrial Technology",
      slug: "ind-tech",
      description: "Field concerned with the application of engineering and manufacturing technology.",
      children: []
    }
  ];

  console.log("📂 Creating category hierarchy...");

  for (const root of hierarchy) {
    // Create Parent
    const parent = await prisma.category.create({
      data: {
        name: root.name,
        slug: root.slug,
        description: root.description,
      }
    });
    console.log(`  > Created Parent: ${parent.name}`);

    // Create Children
    if (root.children && root.children.length > 0) {
      await prisma.category.createMany({
        data: root.children.map(child => ({
          name: child.name,
          slug: child.slug,
          parentId: parent.id
        }))
      });
      console.log(`    + Added ${root.children.length} sub-topics`);
    }
  }

  const count = await prisma.category.count();
  console.log(`\n✅ Database seeded successfully with ${count} total categories!`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
