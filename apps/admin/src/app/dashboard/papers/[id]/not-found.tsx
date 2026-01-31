import Link from 'next/link';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <FileQuestion className="w-24 h-24 mx-auto text-gray-400 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Paper Not Found</h1>
        <p className="text-gray-600 mb-8">
          The paper you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/dashboard/papers"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Papers
        </Link>
      </div>
    </div>
  );
}
