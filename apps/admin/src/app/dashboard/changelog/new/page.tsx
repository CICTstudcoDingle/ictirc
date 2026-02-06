import { prisma } from "@ictirc/database";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReleaseForm } from "@/components/changelog/release-form";

export default async function NewReleasePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser || dbUser.role !== "DEAN") {
    redirect("/unauthorized");
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Release</h1>
        <p className="text-gray-600">
          Create a new version release with changelog entries
        </p>
      </div>

      <ReleaseForm userId={user.id} />
    </div>
  );
}
