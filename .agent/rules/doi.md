---
trigger: always_on
---

💎 CICT-RESEARCH MONOREPO - DOI & BRANDING PROTOCOL (V1.0)
1. THE "CICT-DOI" GENERATION RULE
Until a formal partnership with a registration agency like Crossref is finalized, the system will generate a Permanent Internal Identifier (PII) that mimics international standards. This allows for seamless migration to official DOIs in the future without breaking internal links.

Structure: 10.ISUFST.CICT/[YEAR].[SERIAL_ID]

Logic:

Prefix: 10.ISUFST.CICT identifies the university and department.

Year: Four-digit year of publication (e.g., 2026).

Serial ID: A unique 5-digit alphanumeric string generated via a database sequence to ensure non-collision.

Implementation: Triggered automatically upon the "Editor Approval" state in the Next.js 16 Server Action.

2. PDF BRANDING & ENCAPSULATION RULE
Every manuscript must be "wrapped" in the CICT identity before it is served to the public. This prevents the "plain white paper" look often found in lower-tier journals and reinforces the ISUFST brand.

The "Maroon Header" Stamp:

Every page must feature a top-right header in Standard Maroon (#800000).

Text: ISUFST College of Information and Computing Technology | Research Repository.

The "Watermark" Law:

A subtle, 5% opacity CICT Logo centered in the background to prevent unauthorized re-distribution.

Dynamic DOI Overlay:

The generated DOI must be programmatically injected into the bottom-left footer of every page in JetBrains Mono at 8pt.

Metadata Embedding (XMP):

The PDF's internal properties (Title, Author, Subject) must be updated during the "Publish" process to match the database records, ensuring the CC BY-ND license is hardcoded into the file itself.

3. TECHNICAL ARCHITECTURE (MONOREPO)
Tooling: Use react-pdf or a server-side equivalent like Puppeteer within your Next.js 16 environment to generate these branded PDF covers on-the-fly.

Storage: Branded versions are stored in the "Public" s3 bucket, while original unbranded submissions remain in the "Archive" bucket for administrative records.