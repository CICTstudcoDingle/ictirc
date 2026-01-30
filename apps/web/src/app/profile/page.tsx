import Link from "next/link";
import { User, LogIn, UserPlus, FileText, Settings } from "lucide-react";
import { Button } from "@ictirc/ui";

export default function ProfilePage() {
  // TODO: Check authentication status
  const isLoggedIn = false;

  if (!isLoggedIn) {
    return (
      <div className="pt-14 md:pt-16 min-h-screen">
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          {/* Guest View */}
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to ICTIRC
          </h1>
          <p className="text-gray-600 mb-8">
            Sign in to submit your research, track submissions, and manage your profile.
          </p>

          <div className="space-y-3">
            <Link href="/login" className="block">
              <Button className="w-full" size="lg">
                <LogIn className="w-5 h-5" />
                Sign In
              </Button>
            </Link>
            <Link href="/register" className="block">
              <Button variant="secondary" className="w-full" size="lg">
                <UserPlus className="w-5 h-5" />
                Create Account
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            Are you an admin?{" "}
            <Link href="http://localhost:3001" className="text-maroon hover:underline">
              Go to Admin Portal
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Logged in view (placeholder)
  return (
    <div className="pt-14 md:pt-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-maroon rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">JD</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Juan Dela Cruz</h1>
            <p className="text-gray-500">researcher@isufst.edu.ph</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Link
            href="/my-submissions"
            className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5 text-maroon" />
            <div>
              <p className="font-medium text-gray-900">My Submissions</p>
              <p className="text-sm text-gray-500">3 papers submitted</p>
            </div>
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Account Settings</p>
              <p className="text-sm text-gray-500">Profile, password, notifications</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
