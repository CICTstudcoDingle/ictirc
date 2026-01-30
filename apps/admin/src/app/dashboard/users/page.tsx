"use client";

import { useState, useEffect } from "react";
import { Card, Button } from "@ictirc/ui";
import {
  UserPlus,
  RefreshCw,
  Search,
  Copy,
  Check,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Crown,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: "AUTHOR" | "REVIEWER" | "EDITOR" | "DEAN";
  isActive: boolean;
  createdAt: string;
}

interface InviteToken {
  id: string;
  email: string;
  role: string;
  token: string;
  status: "PENDING" | "ACCEPTED" | "EXPIRED";
  expiresAt: string;
  createdAt: string;
}

const roleIcons: Record<string, React.ReactNode> = {
  AUTHOR: <Shield className="w-4 h-4" />,
  REVIEWER: <ShieldCheck className="w-4 h-4" />,
  EDITOR: <ShieldAlert className="w-4 h-4" />,
  DEAN: <Crown className="w-4 h-4" />,
};

const roleColors: Record<string, string> = {
  AUTHOR: "bg-gray-100 text-gray-700",
  REVIEWER: "bg-blue-100 text-blue-700",
  EDITOR: "bg-purple-100 text-purple-700",
  DEAN: "bg-amber-100 text-amber-700",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pendingInvites, setPendingInvites] = useState<InviteToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("AUTHOR");
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchPendingInvites();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPendingInvites() {
    try {
      const response = await fetch("/api/invites?status=PENDING");
      if (response.ok) {
        const data = await response.json();
        setPendingInvites(data.invites || []);
      }
    } catch (error) {
      console.error("Failed to fetch invites:", error);
    }
  }

  async function handleInviteUser() {
    if (!inviteEmail) return;
    setInviting(true);
    try {
      const response = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      if (response.ok) {
        const data = await response.json();
        setGeneratedToken(data.token);
        fetchPendingInvites();
      }
    } catch (error) {
      console.error("Failed to create invite:", error);
    } finally {
      setInviting(false);
    }
  }

  function copyToken() {
    if (generatedToken) {
      const inviteUrl = `${window.location.origin}/register?token=${generatedToken}`;
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function closeModal() {
    setShowInviteModal(false);
    setInviteEmail("");
    setInviteRole("AUTHOR");
    setGeneratedToken(null);
  }

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage users and send invitations
          </p>
        </div>
        <Button onClick={() => setShowInviteModal(true)} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Invite User
        </Button>
      </div>

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <h3 className="text-sm font-semibold text-amber-800 mb-3">
            Pending Invitations ({pendingInvites.length})
          </h3>
          <div className="space-y-2">
            {pendingInvites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between bg-white p-3 rounded-lg border border-amber-200"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {invite.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    Expires {formatDate(invite.expiresAt)}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-md ${roleColors[invite.role]}`}
                >
                  {invite.role}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search users by email or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
        />
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.name || "—"}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                          roleColors[user.role]
                        }`}
                      >
                        {roleIcons[user.role]}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md p-6 m-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Invite New User
            </h2>

            {!generatedToken ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
                  >
                    <option value="AUTHOR">Author</option>
                    <option value="REVIEWER">Reviewer</option>
                    <option value="EDITOR">Editor</option>
                    <option value="DEAN">Dean</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={closeModal} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleInviteUser}
                    disabled={!inviteEmail || inviting}
                    className="flex-1"
                  >
                    {inviting ? "Generating..." : "Generate Invite"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 mb-2">
                    Invite link generated! Copy and send to the user:
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/register?token=${generatedToken}`}
                      className="flex-1 px-3 py-2 bg-white border border-green-200 rounded-lg font-mono text-xs"
                    />
                    <Button onClick={copyToken} variant="outline" size="icon">
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  This invite will expire in 7 days. The user will need to
                  complete registration using this link.
                </p>

                <Button onClick={closeModal} className="w-full">
                  Done
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
