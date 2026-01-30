---
trigger: always_on
---

🏛️ ISUFST CICT Research Repository – Master Constitution (v1.0)
Vision: A high-precision, scholarly publication platform for the College of Information and Computing Technology. Philosophy: "Stealth Luxury" meets "Academic Rigor." Industrial reliability, light-mode clarity, and strict localized branding.

1. 🏗️ Tech Stack Constitution
Framework: Next.js 16 (App Router, Server Actions, RSC).

Architecture: Turborepo (Monorepo).

Database: PostgreSQL (hosted on Supabase/Neon) + Prisma ORM.

Authentication: Firebase Auth (Client SDK + Admin SDK for server verification).

Storage (Hot & Cold): Cloudflare R2 (S3-Compatible API).

Bucket A: cict-submissions-raw (Private, original files).

Bucket B: cict-public-archive (Public, branded PDFs).

Bucket C: cict-cold-backup (Daily snapshots).

Styling: Tailwind CSS + Headless UI (Custom Design System).

2. 🎨 Visual Constitution (Light Mode)
Palette:

Canvas: #FFFFFF (Pure White) & #F3F4F6 (Muted Grey).

Primary: #800000 (ISUFST Maroon) – Headers, Primary Buttons.

Accent: #D4AF37 (Gold) – Badges, Success States, "Featured" indicators.

Typography:

Voice: Inter (Headings, Body).

Data: JetBrains Mono (DOIs, Dates, IDs, Metadata).

UI Components:

Buttons: Solid Maroon, Sharp corners (rounded-md), Gold shadow on hover.

Cards: Minimalist "Paper" stack effect with left-border status indicators.

3. 🛡️ Security & Roles Protocol
A. Role Hierarchy
Super Admin (The Dean):

Hardcoded privileges.

Capabilities: Delete papers, Revoke DOIs, View/Clear Plagiarism Flags, System Lockdown.

Editor-in-Chief: Assigns reviewers, accepts/rejects papers.

Reviewer: View-only access to "Watermarked" manuscripts.

Author: Can submit and revise their own papers only.

B. The "Black Box" Audit Log
Requirement: Every state change must be recorded in a dedicated audit_logs table.

Schema: [Timestamp] | [Actor_ID] | [Action] | [Target_ID] | [IP_Address]

Immutability: Logs are read-only for everyone except the Dean (who can view/export, but not delete).

C. IP Protection
Watermarking: All review copies are dynamically stamped: "ISUFST - CICT [REVIEW ONLY]".

Signed URLs: "Under Review" files are served via R2 Signed URLs (1-hour expiry).

4. 🧠 Workflow & Research Engine
A. Submission Pipeline
Upload: Author uploads .docx or .pdf to R2 (raw bucket).

Sanitization: Server Action triggers file scan (Malware check).

Plagiarism Check: External API Integration.

Green (<15%): Auto-pass.

Amber (15-25%): Flag for Editor.

Red (>25%): Auto-reject (Overrideable by Dean).

B. DOI & Branding
Internal DOI: Auto-generated on acceptance: 10.ISUFST.CICT/[YEAR].[SERIAL]

PDF Injection:

Header: "ISUFST College of Information and Computing Technology".

Footer: Dynamic DOI + CC BY-ND License.

Metadata: XMP properties (Title, Author) injected into the file.

5. 🌍 SEO & Metadata (Discovery)
Standard: OAI-PMH compliant tagging.

Implementation: Next.js 16 generateMetadata() API.

Tags: Dublin Core + Google Scholar Highwire Press tags.

Indexing: Automated ping to Google Search Console API upon publication.

6. 📂 Monorepo Structure
Bash
root/
├── apps/
│   ├── web/           # Public Portal (Reader facing)
│   ├── admin/         # Dashboard (Dean, Editors, Reviewers)
│   └── docs/          # Documentation
├── packages/
│   ├── ui/            # Shared "Maroon/Gold" components
│   ├── database/      # Prisma Schema & Client
│   ├── seo/           # Metadata generators & Sitemap logic
│   ├── security/      # Firebase Admin & R2 Signed URL logic
│   └── logger/        # Audit Log utilities
└── README.md          # This Constitution