"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button, Input, Label } from "@ictirc/ui";
import { addCommitteeMember } from "../../actions";

interface AddMemberFormProps {
  conferenceId: string;
}

export function AddMemberForm({ conferenceId }: AddMemberFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await addCommitteeMember({
        conferenceId,
        name: formData.get("name") as string,
        position: formData.get("position") as string,
        affiliation: formData.get("affiliation") as string || undefined,
        email: formData.get("email") as string || undefined,
        displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
      });

      if (result.success) {
        setSuccess(true);
        e.currentTarget.reset();
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || "Failed to add member");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Member added successfully!
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., DR. RENANTE A. DIAMANTE"
            required
          />
        </div>
        <div>
          <Label htmlFor="position">Position *</Label>
          <Input
            id="position"
            name="position"
            placeholder="e.g., Overall Chair, IT Chair, Secretariat"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="affiliation">Affiliation</Label>
          <Input
            id="affiliation"
            name="affiliation"
            placeholder="e.g., ISUFST Dingle Campus"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="email@institution.edu"
          />
        </div>
      </div>

      <div className="w-32">
        <Label htmlFor="displayOrder">Display Order</Label>
        <Input
          id="displayOrder"
          name="displayOrder"
          type="number"
          defaultValue="0"
          min="0"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </>
        )}
      </Button>
    </form>
  );
}
