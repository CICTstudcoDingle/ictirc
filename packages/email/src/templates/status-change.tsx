import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export type StatusChangeType =
  | "UNDER_REVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "PUBLISHED";

interface StatusChangeEmailProps {
  paperTitle: string;
  authorName: string;
  submissionId: string;
  newStatus: StatusChangeType;
  doi?: string;
  pdfUrl?: string;
  reviewNote?: string;
}

const STATUS_META: Record<
  StatusChangeType,
  { heading: string; preview: string; message: string; color: string }
> = {
  UNDER_REVIEW: {
    heading: "Your Paper is Now Under Review",
    preview: "Your IRJICT submission is currently being reviewed by our team.",
    message:
      "Your paper has been received and is now under peer review. Our editorial team will carefully evaluate your work. You will be notified once a decision has been made.",
    color: "#2563eb",
  },
  ACCEPTED: {
    heading: "Congratulations — Paper Accepted!",
    preview: "Your IRJICT submission has been accepted for publication.",
    message:
      "We are pleased to inform you that your paper has been accepted for publication in the International Research Journal on Information and Communications Technology (IRJICT). Your work will be published in the upcoming issue.",
    color: "#16a34a",
  },
  REJECTED: {
    heading: "Paper Status Update",
    preview: "An update regarding your IRJICT submission.",
    message:
      "After careful consideration, we regret to inform you that your paper has not been accepted for publication at this time. We encourage you to address the reviewers' feedback and consider resubmitting in a future issue.",
    color: "#dc2626",
  },
  PUBLISHED: {
    heading: "Your Paper Has Been Published!",
    preview: "Your IRJICT paper is now live and publicly available.",
    message:
      "Congratulations! Your paper has been officially published in the International Research Journal on Information and Communications Technology (IRJICT). It is now publicly accessible in our archive.",
    color: "#7c3aed",
  },
};

export function StatusChangeEmail({
  paperTitle,
  authorName,
  submissionId,
  newStatus,
  doi,
  pdfUrl,
  reviewNote,
}: StatusChangeEmailProps) {
  const meta = STATUS_META[newStatus];

  return (
    <Html>
      <Head />
      <Preview>{meta.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* eslint-disable-next-line react/forbid-dom-props -- React Email requires inline styles for email client compatibility */}
          <Section style={{ borderTop: `4px solid ${meta.color}`, padding: 0, margin: 0 }} />
          <Heading style={{ ...heading, color: meta.color }}>{meta.heading}</Heading>
          <Text style={paragraph}>Dear {authorName},</Text>
          <Text style={paragraph}>{meta.message}</Text>

          <Section style={infoBox}>
            <Text style={infoLabel}>Paper Title</Text>
            <Text style={infoValue}>{paperTitle}</Text>
            <Text style={infoLabel}>Submission ID</Text>
            <Text style={infoValueMono}>{submissionId}</Text>
            <Text style={infoLabel}>Status</Text>
            <Text style={{ ...infoValue, color: meta.color, fontWeight: "700" }}>
              {newStatus.replace("_", " ")}
            </Text>
            {doi && (
              <>
                <Text style={infoLabel}>DOI</Text>
                <Text style={infoValueMono}>{doi}</Text>
              </>
            )}
          </Section>

          {reviewNote && (
            <Section style={noteBox}>
              <Text style={infoLabel}>Editorial Note</Text>
              <Text style={noteText}>{reviewNote}</Text>
            </Section>
          )}

          {newStatus === "PUBLISHED" && pdfUrl && (
            <Section style={{ textAlign: "center", margin: "24px 0" }}>
              <Link href={pdfUrl} style={button}>
                View Published Paper
              </Link>
            </Section>
          )}

          {newStatus === "PUBLISHED" && (
            <Section style={{ textAlign: "center", margin: "24px 0" }}>
              <Link href="https://irjict.isufstcict.com/archive" style={archiveLink}>
                Browse Archive
              </Link>
            </Section>
          )}

          <Hr style={hr} />
          <Text style={footer}>
            ISUFST - College of Information and Computing Technology
            <br />
            <Link href="https://irjict.isufstcict.com" style={link}>
              irjict.isufstcict.com
            </Link>
            <br />
            <br />
            This is an automated notification. Please do not reply to this email.
            For inquiries, contact{" "}
            <Link href="mailto:irjict@isufst.edu.ph" style={link}>
              irjict@isufst.edu.ph
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f3f4f6",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  padding: "32px",
  maxWidth: "560px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  overflow: "hidden" as const,
};

const heading = {
  fontSize: "24px",
  fontWeight: "700",
  margin: "0 0 24px",
};

const paragraph = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const infoBox = {
  backgroundColor: "#f9fafb",
  borderLeft: "4px solid #800000",
  padding: "16px",
  margin: "24px 0",
};

const noteBox = {
  backgroundColor: "#fffbeb",
  borderLeft: "4px solid #f59e0b",
  padding: "16px",
  margin: "16px 0",
};

const noteText = {
  color: "#92400e",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "4px 0 0",
};

const infoLabel = {
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  margin: "0 0 4px",
};

const infoValue = {
  color: "#111827",
  fontSize: "16px",
  margin: "0 0 16px",
};

const infoValueMono = {
  color: "#111827",
  fontSize: "14px",
  fontFamily: '"JetBrains Mono", monospace',
  margin: "0 0 16px",
};

const button = {
  backgroundColor: "#800000",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "14px",
  display: "inline-block",
};

const archiveLink = {
  color: "#800000",
  fontSize: "14px",
  textDecoration: "underline",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const footer = {
  color: "#6b7280",
  fontSize: "14px",
  textAlign: "center" as const,
  lineHeight: "22px",
};

const link = {
  color: "#800000",
};
