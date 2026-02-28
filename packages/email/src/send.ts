import { render } from "@react-email/render";
import { getResendClient } from "./client";
import { SubmissionConfirmationEmail } from "./templates/submission-confirmation";
import { PlagiarismPassEmail } from "./templates/plagiarism-pass";

const FROM = process.env.EMAIL_FROM ?? "IRJICT <noreply@isufstcict.com>";

// ── Submission Confirmation ───────────────────────────────────────────────────

interface SendSubmissionConfirmationInput {
  to: string;
  paperTitle: string;
  authorName: string;
  submissionId: string;
  submittedAt: Date;
}

export async function sendSubmissionConfirmation(
  input: SendSubmissionConfirmationInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    const html = await render(
      SubmissionConfirmationEmail({
        paperTitle: input.paperTitle,
        authorName: input.authorName,
        submissionId: input.submissionId,
        submittedAt: input.submittedAt,
      })
    );

    const { error } = await resend.emails.send({
      from: FROM,
      to: input.to,
      subject: `[IRJICT] Submission Received — ${input.paperTitle}`,
      html,
    });

    if (error) {
      console.error("[sendSubmissionConfirmation] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("[sendSubmissionConfirmation] Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// ── Plagiarism Pass Notification ──────────────────────────────────────────────

interface SendPlagiarismPassEmailInput {
  to: string;
  paperTitle: string;
  authorName: string;
  submissionId: string;
  similarityScore: number;
}

export async function sendPlagiarismPassEmail(
  input: SendPlagiarismPassEmailInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    const html = await render(
      PlagiarismPassEmail({
        paperTitle: input.paperTitle,
        authorName: input.authorName,
        submissionId: input.submissionId,
        similarityScore: input.similarityScore,
      })
    );

    const { error } = await resend.emails.send({
      from: FROM,
      to: input.to,
      subject: `[IRJICT] Plagiarism Check Passed — Your Paper is Under Review`,
      html,
    });

    if (error) {
      console.error("[sendPlagiarismPassEmail] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("[sendPlagiarismPassEmail] Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
