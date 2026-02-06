"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SubmissionWizard, type SubmissionWizardProps } from "@ictirc/submission-form";
import { submitPaperAction } from "./actions";

interface SubmitPageClientProps {
  currentUser: {
    id: string;
    name: string;
    email: string;
    affiliation: string;
  };
  categories: SubmissionWizardProps["categories"];
}

export function SubmitPageClient({ currentUser, categories }: SubmitPageClientProps) {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const result = await submitPaperAction(formData);
    return result;
  };

  const handleSuccess = (paperId: string) => {
    setTimeout(() => {
      router.push(`/dashboard/papers/${paperId}`);
    }, 1500);
  };

  return (
    <SubmissionWizard
      isAuthenticated={true}
      currentUser={currentUser}
      categories={categories}
      onSuccess={handleSuccess}
      showToast={(message, type) => {
        if (type === "success") {
          toast.success(message);
        } else {
          toast.error(message);
        }
      }}
      onSubmit={handleSubmit}
      guidelinesUrl="https://ictirc-web.vercel.app/guides"
    />
  );
}
