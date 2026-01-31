'use client';

import { useState } from 'react';
import { PaperStatus } from '@ictirc/database';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface StatusControlProps {
  paperId: string;
  currentStatus: PaperStatus;
}

const statusOptions: { value: PaperStatus; label: string; color: string }[] = [
  { value: 'SUBMITTED', label: 'Submitted', color: 'bg-gray-100 text-gray-800' },
  { value: 'UNDER_REVIEW', label: 'Under Review', color: 'bg-blue-100 text-blue-800' },
  { value: 'ACCEPTED', label: 'Accepted', color: 'bg-green-100 text-green-800' },
  { value: 'PUBLISHED', label: 'Published', color: 'bg-purple-100 text-purple-800' },
  { value: 'REJECTED', label: 'Rejected', color: 'bg-red-100 text-red-800' },
];

export function StatusControl({ paperId, currentStatus }: StatusControlProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<PaperStatus | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastDoi, setToastDoi] = useState<string | null>(null);

  const handleStatusSelect = (newStatus: PaperStatus) => {
    if (newStatus === status || isUpdating) return;
    setPendingStatus(newStatus);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!pendingStatus) return;

    setShowConfirm(false);
    setIsUpdating(true);

    try {
      const response = await fetch('/api/papers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: paperId, status: pendingStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      const updated = await response.json();
      setStatus(updated.status);

      // Show success toast
      if (updated.doi) {
        setToastMessage('Status updated and DOI assigned!');
        setToastDoi(updated.doi);
      } else {
        setToastMessage('Paper status updated successfully!');
        setToastDoi(null);
      }
      setShowToast(true);

      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        setShowToast(false);
        if (updated.doi) {
          window.location.reload();
        }
      }, 5000);
    } catch (error) {
      console.error('Error updating status:', error);
      setToastMessage('Failed to update status. Please try again.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } finally {
      setIsUpdating(false);
      setPendingStatus(null);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setPendingStatus(null);
  };

  const currentOption = statusOptions.find((opt) => opt.value === status);
  const pendingOption = statusOptions.find((opt) => opt.value === pendingStatus);

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Status:</span>
        <select
          value={status}
          onChange={(e) => handleStatusSelect(e.target.value as PaperStatus)}
          disabled={isUpdating}
          aria-label="Change paper status"
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border-0 cursor-pointer transition-colors ${
            currentOption?.color || 'bg-gray-100 text-gray-800'
          } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Confirm Status Change
                </h3>
                <p className="text-gray-600">
                  Change paper status from <span className="font-medium">{status.replace('_', ' ')}</span> to{' '}
                  <span className="font-medium">{pendingStatus?.replace('_', ' ')}</span>?
                </p>
                {pendingStatus === 'PUBLISHED' && (
                  <p className="text-sm text-blue-600 mt-2">
                    ℹ️ This will auto-generate a DOI if not already assigned.
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-md">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-green-100 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{toastMessage}</p>
                {toastDoi && (
                  <p className="text-sm text-gray-600 mt-1 font-mono">
                    DOI: {toastDoi}
                  </p>
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
