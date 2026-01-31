'use client';

import { useState } from 'react';
import { CheckCircle, Loader2, Upload, AlertCircle, X } from 'lucide-react';
import { publishPaper } from '@/app/dashboard/papers/[id]/actions';

interface PublishButtonProps {
  paperId: string;
  hasFile: boolean;
  isDocx: boolean;
}

export function PublishButton({ paperId, hasFile, isDocx }: PublishButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [progress, setProgress] = useState<'converting' | 'uploading' | 'finalizing' | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState<{ success: boolean; message: string; doi?: string }>({
    success: false,
    message: '',
  });

  const handlePublish = async () => {
    setShowModal(false);
    setIsPublishing(true);

    try {
      // Show conversion progress if DOCX
      if (isDocx) {
        setProgress('converting');
        await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay to show state
      }

      // Call publish action
      const result = await publishPaper(paperId);

      if (isDocx) {
        setProgress('uploading');
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setProgress('finalizing');
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (result.success) {
        setToastData({
          success: true,
          message: 'Paper published successfully!',
          doi: result.doi,
        });
        setShowToast(true);

        // Reload page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setToastData({
          success: false,
          message: result.error || 'Failed to publish paper',
        });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      }
    } catch (error) {
      setToastData({
        success: false,
        message: 'An unexpected error occurred',
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } finally {
      setIsPublishing(false);
      setProgress(null);
    }
  };

  if (!hasFile) {
    return (
      <button
        disabled
        className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
        title="No file uploaded"
      >
        <Upload className="w-4 h-4 inline mr-2" />
        Publish Paper
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={isPublishing}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPublishing ? (
          <>
            <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
            Publishing...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 inline mr-2" />
            Publish Paper
          </>
        )}
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Publish Paper?</h3>
                <p className="text-gray-600 mb-2">
                  This will publish the paper and make it publicly available in the archive.
                </p>
                {isDocx && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                    <p className="text-sm text-blue-800">
                      ℹ️ The DOCX file will be automatically converted to PDF before publishing.
                    </p>
                  </div>
                )}
                <ul className="text-sm text-gray-600 mt-3 space-y-1">
                  <li>✓ Status will change to PUBLISHED</li>
                  <li>✓ DOI will be auto-generated</li>
                  {isDocx && <li>✓ File will be converted to PDF</li>}
                  <li>✓ Paper will appear in public archive</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Confirm & Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Modal */}
      {isPublishing && progress && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {progress === 'converting' && 'Converting DOCX to PDF...'}
                {progress === 'uploading' && 'Uploading PDF...'}
                {progress === 'finalizing' && 'Finalizing Publication...'}
              </h3>
              <p className="text-gray-600 text-sm">
                Please wait while we process your paper.
              </p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-blue-600 h-2 rounded-full transition-all duration-500 ${
                    progress === 'converting'
                      ? 'w-1/3'
                      : progress === 'uploading'
                      ? 'w-2/3'
                      : 'w-full'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-md">
            <div className="flex items-start gap-3">
              <div className={`p-1 rounded-full ${toastData.success ? 'bg-green-100' : 'bg-red-100'}`}>
                {toastData.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{toastData.message}</p>
                {toastData.doi && (
                  <p className="text-sm text-gray-600 mt-1 font-mono">DOI: {toastData.doi}</p>
                )}
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Close"
                aria-label="Close notification"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
