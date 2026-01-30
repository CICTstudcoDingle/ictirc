
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  "Artificial Intelligence & Machine Learning",
  "Cybersecurity",
  "Data Science & Analytics",
  "Internet of Things (IoT)",
  "Blockchain Technology",
  "Natural Language Processing",
  "Computer Vision",
  "Software Engineering",
  "Network & Communications",
  "Human-Computer Interaction",
];

async function main() {
  console.log("Seeding categories...");

  for (const name of categories) {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    await prisma.category.upsert({
      where: { name },
      update: {},
      create: {
        name,
        slug,
      },
    });
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
