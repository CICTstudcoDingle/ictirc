"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldX, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@ictirc/ui";

const REASON_MESSAGES: Record<string, { title: string; description: string }> = {
  no_account: {
    title: "Account Not Found",
    description:
      "Your account has not been set up in the system. Please contact the administrator to request access.",
  },
  deactivated: {
    title: "Account Deactivated",
    description:
      "Your account has been deactivated. Please contact the Dean or system administrator for assistance.",
  },
  insufficient_role: {
    title: "Access Denied",
    description:
      "You do not have sufficient permissions to access this resource. Contact your administrator if you believe this is an error.",
  },
  default: {
    title: "Unauthorized",
    description:
      "You are not authorized to access this page. Please log in with an authorized account.",
  },
};

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "default";
  const requiredRoles = searchParams.get("required");

  const { title, description } =
    REASON_MESSAGES[reason] || REASON_MESSAGES.default;

  return (
    <div className="max-w-md w-full text-center">
      {/* Icon */}
      <div className="mx-auto w-20 h-20 bg-maroon/10 rounded-full flex items-center justify-center mb-6">
        <ShieldX className="w-10 h-10 text-maroon" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>

      {/* Description */}
      <p className="text-gray-600 mb-6">{description}</p>

      {/* Required roles info */}
      {requiredRoles && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-800">
            <span className="font-medium">Required role(s):</span>{" "}
            {requiredRoles.split(",").join(", ")}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/dashboard">
          <Button variant="secondary" className="w-full sm:w-auto">
            <ArrowLeft className="w-4 h-4" />
            Go to Dashboard
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="primary" className="w-full sm:w-auto">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </Link>
      </div>

      {/* Contact info */}
      <p className="mt-8 text-sm text-gray-500">
        Need help?{" "}
        <a
          href="mailto:cict@isufst.edu.ph"
          className="text-maroon hover:underline"
        >
          Contact CICT Support
        </a>
      </p>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
        <UnauthorizedContent />
      </Suspense>
    </div>
  );
}

