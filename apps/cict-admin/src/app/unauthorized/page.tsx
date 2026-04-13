import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="panel w-full max-w-lg p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold text-maroon">Unauthorized</h1>
        <p className="text-gray-600">
          Your account does not have access to this page in CICT Admin.
        </p>
        <Link href="/dashboard" className="btn-primary">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
