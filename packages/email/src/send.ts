import { render } from "@react-email/render";
import { getResendClient } from "./client";
import { SubmissionConfirmationEmail } from "./templates/submission-confirmation";
import { PlagiarismPassEmail } from "./templates/plagiarism-pass";
import { StatusChangeEmail, type StatusChangeType } from "./templates/status-change";

const FROM = process.env.EMAIL_FROM ?? "IRJICT <noreply@isufstcict.com>";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? "irjict@isufst.edu.ph";

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

// ── Status Change Notification ────────────────────────────────────────────────

const STATUS_SUBJECTS: Record<StatusChangeType, string> = {
  UNDER_REVIEW: "[IRJICT] Your Paper is Now Under Review",
  ACCEPTED: "[IRJICT] Congratulations — Your Paper Has Been Accepted!",
  REJECTED: "[IRJICT] Update on Your IRJICT Submission",
  PUBLISHED: "[IRJICT] Your Paper Has Been Published!",
};

interface SendStatusChangeEmailInput {
  /** Author email address */
  to: string;
  paperTitle: string;
  authorName: string;
  submissionId: string;
  newStatus: StatusChangeType;
  doi?: string;
  pdfUrl?: string;
  /** Optional editor/reviewer note */
  reviewNote?: string;
  /** Whether to also BCC the admin notification email */
  notifyAdmin?: boolean;
}

export async function sendStatusChangeEmail(
  input: SendStatusChangeEmailInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    const html = await render(
      StatusChangeEmail({
        paperTitle: input.paperTitle,
        authorName: input.authorName,
        submissionId: input.submissionId,
        newStatus: input.newStatus,
        doi: input.doi,
        pdfUrl: input.pdfUrl,
        reviewNote: input.reviewNote,
      })
    );

    const { error } = await resend.emails.send({
      from: FROM,
      to: input.to,
      bcc: input.notifyAdmin ? [ADMIN_EMAIL] : undefined,
      subject: STATUS_SUBJECTS[input.newStatus],
      html,
    });

    if (error) {
      console.error("[sendStatusChangeEmail] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("[sendStatusChangeEmail] Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
