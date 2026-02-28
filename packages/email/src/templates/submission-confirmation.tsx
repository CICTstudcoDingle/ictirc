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

interface SubmissionConfirmationEmailProps {
  paperTitle: string;
  authorName: string;
  submissionId: string;
  submittedAt: Date;
}

export function SubmissionConfirmationEmail({
  paperTitle,
  authorName,
  submissionId,
  submittedAt,
}: SubmissionConfirmationEmailProps) {
  const formattedDate = submittedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Html>
      <Head />
      <Preview>Your research paper has been submitted to ICTIRC</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Submission Received</Heading>
          <Text style={paragraph}>Dear {authorName},</Text>
          <Text style={paragraph}>
            Thank you for submitting your research paper to the{" "}
            <strong>
              Information and Communication Technology International Research
              Conference (ICTIRC)
            </strong>
            .
          </Text>
          <Section style={infoBox}>
            <Text style={infoLabel}>Paper Title</Text>
            <Text style={infoValue}>{paperTitle}</Text>
            <Text style={infoLabel}>Submission ID</Text>
            <Text style={infoValueMono}>{submissionId}</Text>
            <Text style={infoLabel}>Date Submitted</Text>
            <Text style={infoValue}>{formattedDate}</Text>
          </Section>
          <Text style={paragraph}>
            Your submission is now being reviewed. You will receive an email
            notification once a decision has been made.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            ISUFST - College of Information and Computing Technology
            <br />
            <Link href="https://irjict.isufstcict.com" style={link}>
              irjict.isufstcict.com
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
};

const heading = {
  color: "#800000",
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

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const footer = {
  color: "#6b7280",
  fontSize: "14px",
  textAlign: "center" as const,
};

const link = {
  color: "#800000",
};
