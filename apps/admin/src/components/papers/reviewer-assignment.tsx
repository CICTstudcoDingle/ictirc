'use client';

import { useState, useEffect } from 'react';
import { Users, X, Plus } from 'lucide-react';

interface Reviewer {
  id: string;
  reviewer: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
  assignedAt: Date;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface ReviewerAssignmentProps {
  paperId: string;
  currentReviewers: Reviewer[];
}

export function ReviewerAssignment({ paperId, currentReviewers }: ReviewerAssignmentProps) {
  const [reviewers, setReviewers] = useState(currentReviewers);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAvailableReviewers();
  }, []);

  const fetchAvailableReviewers = async () => {
    try {
      const response = await fetch('/api/users?role=REVIEWER,EDITOR');
      if (response.ok) {
        const users = await response.json();
        setAvailableUsers(users);
      }
    } catch (error) {
      console.error('Error fetching reviewers:', error);
    }
  };

  const handleAssign = async (userId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/papers/${paperId}/reviewers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewerId: userId }),
      });

      if (!response.ok) throw new Error('Failed to assign reviewer');

      const newAssignment = await response.json();
      setReviewers((prev) => [...prev, newAssignment]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error assigning reviewer:', error);
      alert('Failed to assign reviewer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (assignmentId: string) => {
    if (!confirm('Remove this reviewer?')) return;

    try {
      const response = await fetch(`/api/papers/${paperId}/reviewers`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId }),
      });

      if (!response.ok) throw new Error('Failed to remove reviewer');

      setReviewers((prev) => prev.filter((r) => r.id !== assignmentId));
    } catch (error) {
      console.error('Error removing reviewer:', error);
      alert('Failed to remove reviewer. Please try again.');
    }
  };

  const assignedUserIds = reviewers.map((r) => r.reviewer.id);
  const unassignedUsers = availableUsers.filter((u) => !assignedUserIds.includes(u.id));

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Assigned Reviewers
        </h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors"
          title="Assign reviewer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {reviewers.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No reviewers assigned yet
          </p>
        ) : (
          reviewers.map((assignment) => (
            <div
              key={assignment.id}
              className="flex items-center justify-between p-2 border rounded bg-gray-50"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {assignment.reviewer.name || assignment.reviewer.email}
                </p>
                <p className="text-xs text-gray-500">
                  {assignment.reviewer.role} • Assigned{' '}
                  {new Date(assignment.assignedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleRemove(assignment.id)}
                className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
                title="Remove reviewer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Reviewer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Assign Reviewer</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {unassignedUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No available reviewers to assign
                </p>
              ) : (
                <div className="space-y-2">
                  {unassignedUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleAssign(user.id)}
                      disabled={isLoading}
                      className="w-full text-left p-3 border rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <p className="font-medium text-gray-900">
                        {user.name || user.email}
                      </p>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
