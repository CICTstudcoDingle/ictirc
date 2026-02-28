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

interface PlagiarismPassEmailProps {
  paperTitle: string;
  authorName: string;
  submissionId: string;
  similarityScore: number;
}

export function PlagiarismPassEmail({
  paperTitle,
  authorName,
  submissionId,
  similarityScore,
}: PlagiarismPassEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your manuscript passed the plagiarism check and is now under review — IRJICT</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header badge */}
          <Section style={badge}>
            <Text style={badgeText}>✓ Plagiarism Check Passed</Text>
          </Section>

          <Heading style={heading}>Your Paper is Now Under Review</Heading>

          <Text style={paragraph}>Dear {authorName},</Text>

          <Text style={paragraph}>
            We are pleased to inform you that your manuscript has successfully
            passed the initial plagiarism check and has been forwarded to our
            editorial team for peer review.
          </Text>

          <Section style={infoBox}>
            <Text style={infoLabel}>Paper Title</Text>
            <Text style={infoValue}>{paperTitle}</Text>

            <Text style={infoLabel}>Submission ID</Text>
            <Text style={infoValueMono}>{submissionId}</Text>

            <Text style={infoLabel}>Plagiarism Check</Text>
            <Text style={infoValueGreen}>
              Passed — {similarityScore.toFixed(1)}% similarity (threshold: &lt;15%)
            </Text>

            <Text style={infoLabel}>Current Status</Text>
            <Text style={infoValue}>Under Editorial Review</Text>
          </Section>

          <Text style={paragraph}>
            <strong>What happens next?</strong>
          </Text>
          <Text style={paragraph}>
            Your manuscript will undergo a double-blind peer review process. Our
            reviewers will assess the originality, methodology, and contribution
            of your work. The review process typically takes{" "}
            <strong>15–20 working days</strong>.
          </Text>
          <Text style={paragraph}>
            You will receive another email once a final decision has been made.
            In the meantime, you may track your submission status on our website
            using your Submission ID.
          </Text>

          <Section style={trackBox}>
            <Text style={trackText}>
              Track your submission at:{" "}
              <Link href="https://irjict.isufstcict.com/track" style={link}>
                irjict.isufstcict.com/track
              </Link>
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            ISUFST - College of Information and Computing Technology
            <br />
            International Research Journal of Information and Communications Technology (IRJICT)
            <br />
            <Link href="https://irjict.isufstcict.com" style={link}>
              irjict.isufstcict.com
            </Link>
            <br />
            <Link href="mailto:cict_dingle@isufst.edu.ph" style={link}>
              cict_dingle@isufst.edu.ph
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const main = {
  backgroundColor: "#f3f4f6",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  padding: "32px",
  maxWidth: "560px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
};

const badge = {
  backgroundColor: "#dcfce7",
  borderRadius: "6px",
  padding: "8px 16px",
  margin: "0 0 24px",
  display: "inline-block" as const,
};

const badgeText = {
  color: "#15803d",
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "0",
};

const heading = {
  color: "#800000",
  fontSize: "22px",
  fontWeight: "700" as const,
  margin: "0 0 24px",
};

const paragraph = {
  color: "#374151",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "12px 0",
};

const infoBox = {
  backgroundColor: "#f9fafb",
  borderLeft: "4px solid #800000",
  padding: "16px",
  margin: "24px 0",
};

const infoLabel = {
  color: "#6b7280",
  fontSize: "11px",
  fontWeight: "600" as const,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 4px",
};

const infoValue = {
  color: "#111827",
  fontSize: "15px",
  margin: "0 0 14px",
};

const infoValueMono = {
  color: "#111827",
  fontSize: "13px",
  fontFamily: '"JetBrains Mono", "Courier New", monospace',
  margin: "0 0 14px",
};

const infoValueGreen = {
  color: "#15803d",
  fontSize: "15px",
  fontWeight: "600" as const,
  margin: "0 0 14px",
};

const trackBox = {
  backgroundColor: "#fef3c7",
  borderRadius: "6px",
  padding: "12px 16px",
  margin: "20px 0",
};

const trackText = {
  color: "#92400e",
  fontSize: "14px",
  margin: "0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  textAlign: "center" as const,
  lineHeight: "20px",
};

const link = {
  color: "#800000",
};
