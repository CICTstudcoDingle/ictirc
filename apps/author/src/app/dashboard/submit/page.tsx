import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@ictirc/database";
import { SubmitPageClient } from "./client";

export default async function SubmitPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user info from database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true },
  });

  // Get author info for affiliation
  const author = await prisma.author.findUnique({
    where: { email: user.email! },
    select: { affiliation: true },
  });

  // Get categories for the form
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      parentId: true,
    },
  });

  const currentUser = {
    id: user.id,
    name: dbUser?.name || user.email?.split("@")[0] || "Author",
    email: user.email!,
    affiliation: author?.affiliation || "ISUFST - CICT",
  };

  return (
    <SubmitPageClient
      currentUser={currentUser}
      categories={categories}
    />
  );
}
