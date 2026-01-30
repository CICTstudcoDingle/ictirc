---
trigger: always_on
---

💎 CICT-RESEARCH MONOREPO - SECURITY & PERFORMANCE CONSTITUTION (V1.0)
1. SECURITY CORE ("THE DEAN'S SEAL")
Philosophy: Trust is good, but permission is better. The system operates on a "Zero Trust" model for all users until authenticated via Firebase.

The "Super-Admin" Law:

The super_admin role is exclusively hardcoded/reserved for the Dean of CICT.

Capabilities: Only the Dean can "Hard Delete" a manuscript, revoke a published DOI, or override a Plagiarism Flag.

Emergency Protocol: The Dean possesses a "System Lock" switch in the admin dashboard to freeze all submissions in case of a security breach.

2. INTELLECTUAL PROPERTY PROTECTION (THE "WATERMARK" PROTOCOL)
Reviewer Access Rule:

Reviewers never access the raw source file. They are served a dynamically generated "Review Copy."

The "ISUFST-CICT" Overlay: Every page of a manuscript under review must be stamped diagonally with ISUFST - CICT [REVIEW ONLY] in 15% opacity Grey.

Storage Segmentation:

manuscripts (Supabase Hot Storage): Contains original files. Access control via Supabase RLS policies based on user role.

cict-cold-storage (R2): Private. Contains backups and archival copies. Accessible ONLY by System.

Signed URL Strategy:

All "Under Review" papers are served via Time-Limited Signed URLs (valid for 1 hour). This prevents reviewers from sharing direct links to unauthorized parties.

3. AUTHENTICATION & MIDDLEWARE (NEXT.JS 16)
Role-Based Access Control (RBAC):

We use Next.js Middleware (middleware.ts) to intercept every request.

User roles stored in PostgreSQL database (User model with UserRole enum: AUTHOR, REVIEWER, EDITOR, DEAN).

Logic:

TypeScript
// Next.js 16 Middleware with Supabase Auth
const { data: { user } } = await supabase.auth.getUser();
const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
if (route.startsWith('/admin/system') && dbUser.role !== 'DEAN') {
   return NextResponse.redirect(new URL('/unauthorized', req.url));
}
Data Sanitation:

All inputs (Forms, Search Bars) are validated server-side using Zod. This blocks SQL Injection and XSS attacks before they reach the database.

4. PERFORMANCE STANDARDS ("SPEED OF LIGHT")
Server Components (RSC):

The Public Archive (apps/web) uses React Server Components by default. This means the heavy lifting of fetching paper metadata happens on the server, sending zero JavaScript to the client for the initial view.

The "Skeleton" Rule:

While the PDF viewer is loading, the user must see a Maroon/Gold pulse skeleton UI. We never show a blank white screen.

Database Indexing:

PostgreSQL indices must be created for: author_name, publication_year, and keywords to ensure search results appear in <100ms.