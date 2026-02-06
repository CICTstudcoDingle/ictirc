import { createClient } from "@/lib/supabase/server";
import { prisma } from "@ictirc/database";
import { redirect } from "next/navigation";
import { ProfileClient } from "./client";
import { Card, CardContent, Button } from "@ictirc/ui";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user from database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      avatarUrl: true,
    },
  });

  // User authenticated but not in DB - show sync UI
  if (!dbUser) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Setup Required</h1>
          <p className="text-gray-600 mt-1">
            Complete your profile setup to access all features
          </p>
        </div>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Database Record Missing
                </h3>
                <p className="text-sm text-yellow-800 mb-4">
                  Your account is authenticated via Supabase but hasn't been synced to our database yet. 
                  This can happen if you registered before the sync system was implemented. 
                  Click the button below to complete your profile setup.
                </p>
                <form action="/api/sync" method="POST">
                  <Button type="submit" className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Sync Account to Database
                  </Button>
                </form>
                <p className="text-xs text-yellow-700 mt-3">
                  If the problem persists, please contact support at{" "}
                  <a href="mailto:ictirc@isufst.edu.ph" className="underline">
                    ictirc@isufst.edu.ph
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/dashboard" className="text-maroon hover:underline">
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Get author info
  const author = await prisma.author.findUnique({
    where: { email: user.email! },
    select: { affiliation: true },
  });

  return (
    <ProfileClient
      user={{
        id: dbUser.id,
        name: dbUser.name || "Anonymous",
        email: dbUser.email,
        role: String(dbUser.role),
        createdAt: dbUser.createdAt.toISOString(),
        avatarUrl: dbUser.avatarUrl,
      }}
      author={author}
    />
  );
}
