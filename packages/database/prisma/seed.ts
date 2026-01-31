import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Artificial Intelligence & Machine Learning",
    slug: "ai-ml",
    description: "Research on AI, machine learning, deep learning, neural networks, and related technologies.",
  },
  {
    name: "Cybersecurity",
    slug: "cybersecurity",
    description: "Studies on information security, cryptography, network security, and threat analysis.",
  },
  {
    name: "Data Science & Analytics",
    slug: "data-science",
    description: "Research on data mining, big data, statistical analysis, and data visualization.",
  },
  {
    name: "Internet of Things (IoT)",
    slug: "iot",
    description: "Studies on embedded systems, smart devices, sensor networks, and IoT applications.",
  },
  {
    name: "Blockchain Technology",
    slug: "blockchain",
    description: "Research on distributed ledger technology, smart contracts, and decentralized applications.",
  },
  {
    name: "Natural Language Processing",
    slug: "nlp",
    description: "Studies on computational linguistics, text analysis, and language models.",
  },
  {
    name: "Computer Vision",
    slug: "computer-vision",
    description: "Research on image processing, pattern recognition, and visual computing.",
  },
  {
    name: "Software Engineering",
    slug: "software-engineering",
    description: "Studies on software development methodologies, testing, and software architecture.",
  },
  {
    name: "Network & Communications",
    slug: "networking",
    description: "Research on computer networks, wireless communications, and network protocols.",
  },
  {
    name: "Human-Computer Interaction",
    slug: "hci",
    description: "Studies on user interface design, usability, accessibility, and user experience.",
  },
];

async function main() {
  console.log("🌱 Seeding database...\n");

  // Seed categories using createMany with skipDuplicates
  console.log("📂 Creating categories...");
  
  const result = await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });
  
  console.log(`  ✓ Created ${result.count} new categories`);
  
  // Fetch and display all categories
  const allCategories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  
  console.log(`\n📋 All categories (${allCategories.length}):`);
  for (const cat of allCategories) {
    console.log(`  - ${cat.name} (${cat.slug})`);
  }

  console.log("\n✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
