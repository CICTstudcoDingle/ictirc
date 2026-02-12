import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany({
    include: {
      parent: true,
      children: true
    },
    orderBy: {
      name: 'asc'
    }
  });

  console.log("\n📊 CURRENT CATEGORY HIERARCHY:\n");
  
  const roots = categories.filter(c => !c.parentId);
  
  roots.forEach(root => {
    console.log(`- ${root.name} (${root.slug})`);
    root.children.forEach(child => {
      console.log(`  └─ ${child.name} (${child.slug})`);
    });
  });

  console.log(`\nTotal categories: ${categories.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
