# ICTIRC - Information & Communication Technology International Research Conference

<div align="center">

![ICTIRC Banner](apps/web/public/images/ictirc-banner.png)

**A modern, full-stack research repository and conference management system for the CICT Department**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?logo=supabase)](https://supabase.com/)
[![pnpm](https://img.shields.io/badge/pnpm-9.1.0-F69220?logo=pnpm)](https://pnpm.io/)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-EF4444?logo=turborepo)](https://turbo.build/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Database](#-database)
- [Storage System](#-storage-system)
- [RBAC & Authentication](#-rbac--authentication)
- [Development](#-development)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

ICTIRC (Information & Communication Technology International Research Conference) is a comprehensive platform designed for the College of Information and Communications Technology (CICT) at Universitas Brawijaya. It serves as both a research paper repository and conference management system, enabling:

- **Researchers** to submit, track, and publish academic papers
- **Reviewers** to evaluate submissions with structured feedback
- **Editors** to manage the publication workflow
- **Administrators** to oversee users, events, and system settings
- **Public visitors** to browse the archive and register for conferences

The platform emphasizes **security**, **scalability**, and **user experience** with modern web technologies.

---

## ✨ Features

### 🔐 **Multi-Tier RBAC System**
- 4-tier role hierarchy: **DEAN** → **EDITOR** → **REVIEWER** → **AUTHOR**
- Database-backed permission enforcement
- Route-level middleware protection
- Fine-grained access control for sensitive operations

### 📄 **Paper Management**
- Streamlined submission workflow with file uploads
- DOI assignment and metadata management
- Status tracking (DRAFT → UNDER_REVIEW → ACCEPTED → PUBLISHED → REJECTED)
- Plagiarism detection integration (Turnitin API ready)
- Full-text search and filtering

### 💾 **Dual Storage Architecture**
- **Hot Storage**: Supabase for active manuscripts (fast retrieval)
- **Cold Storage**: Cloudflare R2 for archival (cost-efficient)
- Automatic tier migration based on access patterns
- Pre-signed URL generation for secure downloads

### 🎪 **Conference Management**
- Event creation with timeline visualization
- Registration system with QR code generation
- Upcoming event cards with countdown timers
- Dynamic metadata for SEO optimization

### 📊 **Admin Dashboard**
- Real-time statistics and analytics
- User management with invite token system
- Audit logging for compliance
- System settings and configuration

### 🌐 **Public Interface**
- Browse research archive with advanced filters
- Responsive design (desktop, tablet, mobile)
- Accessibility-compliant (WCAG 2.1 AA)
- SEO-optimized with automatic sitemap/robots.txt

### 🔒 **Security & Compliance**
- Supabase Auth with SSR support
- Row-Level Security (RLS) policies
- Input validation with Zod schemas
- Rate limiting on sensitive endpoints
- Comprehensive audit trail

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [Next.js 16.2.0-canary.21](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Components**: Custom UI library (`@ictirc/ui`)

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/) (v20+)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via Supabase)
- **ORM**: [Prisma 6.x](https://www.prisma.io/)
- **Authentication**: [Supabase Auth](https://supabase.com/auth) with SSR
- **File Storage**: Supabase Storage + [Cloudflare R2](https://www.cloudflare.com/products/r2/)

### **Developer Experience**
- **Language**: [TypeScript 5.7.3](https://www.typescriptlang.org/)
- **Package Manager**: [pnpm 9.1.0](https://pnpm.io/) (workspace protocol)
- **Monorepo**: [Turborepo](https://turbo.build/)
- **Linting**: [ESLint](https://eslint.org/) (shared configs)
- **Formatting**: [Prettier](https://prettier.io/) (via ESLint plugin)

### **Infrastructure**
- **Hosting**: [Vercel](https://vercel.com/) (with standalone output)
- **CDN**: Cloudflare (R2 storage)
- **Email**: [Resend](https://resend.com/) (transactional emails)
- **Monitoring**: Vercel Analytics

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v20 or higher ([Download](https://nodejs.org/))
- **pnpm** v9.1.0 or higher (install via `npm install -g pnpm`)
- **PostgreSQL** database (or [Supabase](https://supabase.com/) project)
- **Git** ([Download](https://git-scm.com/))

### **Required Accounts**
- [Supabase](https://supabase.com/) (free tier available)
- [Cloudflare](https://cloudflare.com/) (for R2 storage)
- [Resend](https://resend.com/) (for email notifications)
- [Turnitin](https://www.turnitin.com/) (optional, for plagiarism detection)

---

## 🚀 Installation

### **1. Clone the Repository**

```bash
git clone https://github.com/CICTstudcoDingle/ictirc.git
cd ictirc
```

### **2. Install Dependencies**

```bash
pnpm install
```

This will install all dependencies for the monorepo, including apps and packages.

### **3. Set Up Environment Variables**

Copy the example environment files and fill in your credentials:

```bash
# Root .env (for database package)
cp .env.example .env

# Web app
cp apps/web/.env.example apps/web/.env.local

# Admin app
cp apps/admin/.env.example apps/admin/.env.local
```

See [Environment Setup](#-environment-setup) for detailed configuration.

### **4. Initialize the Database**

```bash
# Generate Prisma Client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed initial data (optional)
pnpm db:seed
```

### **5. Run Development Servers**

```bash
# Run all apps in development mode
pnpm dev

# Or run specific apps
pnpm dev:web    # Public web app (http://localhost:3000)
pnpm dev:admin  # Admin dashboard (http://localhost:3001)
```

---

## 🔐 Environment Setup

### **Root `.env`** (Database Package)

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres"
```

### **`apps/web/.env.local`** (Public Web App)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Storage
NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://your-project.supabase.co/storage/v1
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=cict-cold-storage
R2_PUBLIC_URL=https://your-r2-bucket.r2.dev

# Email
RESEND_API_KEY=re_your-api-key
FROM_EMAIL=noreply@yourdomain.com

# Turnitin (optional)
TURNITIN_API_KEY=your-turnitin-api-key
TURNITIN_API_URL=https://api.turnitin.com/v1

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### **`apps/admin/.env.local`** (Admin Dashboard)

```env
# Supabase (same as web app)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3001
NODE_ENV=development
```

> **Note**: Never commit actual credentials. Use placeholder values in `.env.example` files.

---

## 📁 Project Structure

```
ictirc/
├── apps/
│   ├── web/                  # Public-facing website
│   │   ├── src/
│   │   │   ├── app/          # Next.js App Router pages
│   │   │   │   ├── page.tsx              # Homepage with hero
│   │   │   │   ├── about/                # About page
│   │   │   │   ├── archive/              # Research archive
│   │   │   │   ├── conferences/          # Event listings & details
│   │   │   │   ├── guides/               # Research guides
│   │   │   │   ├── submit/               # Paper submission
│   │   │   │   └── api/                  # API routes
│   │   │   ├── components/   # React components
│   │   │   └── lib/          # Utilities (Supabase, validation)
│   │   └── public/           # Static assets
│   │
│   └── admin/                # Admin dashboard
│       ├── middleware.ts     # RBAC route protection
│       ├── src/
│       │   ├── app/
│       │   │   ├── dashboard/
│       │   │   │   ├── page.tsx          # Dashboard home
│       │   │   │   ├── papers/           # Paper management
│       │   │   │   ├── users/            # User management
│       │   │   │   ├── audit-logs/       # Audit trail
│       │   │   │   └── settings/         # System settings
│       │   │   ├── login/                # Admin login
│       │   │   └── unauthorized/         # 403 page
│       │   └── lib/
│       │       └── rbac.ts   # Permission helpers
│       └── public/
│
├── packages/
│   ├── database/             # Prisma schema & client
│   │   ├── prisma/
│   │   │   └── schema.prisma # Database models
│   │   └── src/
│   │       ├── client.ts     # Prisma client singleton
│   │       ├── seed.ts       # Database seeding
│   │       └── test-connection.ts
│   │
│   ├── storage/              # Dual storage abstraction
│   │   └── src/
│   │       ├── r2/           # Cloudflare R2 operations
│   │       ├── supabase/     # Supabase Storage operations
│   │       └── types.ts      # Shared types
│   │
│   ├── email/                # Email templates & client
│   │   └── src/
│   │       ├── client.ts     # Resend integration
│   │       └── templates/    # React Email templates
│   │
│   ├── ui/                   # Shared component library
│   │   └── src/components/   # Buttons, inputs, cards, etc.
│   │
│   ├── seo/                  # SEO utilities & metadata
│   │   └── src/
│   │       └── metadata.ts   # OpenGraph, Twitter cards
│   │
│   └── config/               # Shared configurations
│       ├── eslint.config.mjs # ESLint rules
│       └── typescript.json   # Base TypeScript config
│
├── .agent/                   # AI agent rules (architecture, security)
├── pnpm-workspace.yaml       # Workspace configuration
├── turbo.json                # Turborepo pipeline
├── package.json              # Root package scripts
└── README.md                 # This file
```

---

## 🏗️ Architecture

### **Monorepo Design**

ICTIRC uses **Turborepo** for efficient monorepo management:

- **Apps**: Full Next.js applications (`web`, `admin`)
- **Packages**: Shared libraries and utilities
- **Workspace Protocol**: `workspace:*` for internal dependencies
- **Parallel Builds**: Turborepo caches and parallelizes tasks

### **Design Principles**

1. **Separation of Concerns**: Public web app and admin dashboard are separate applications
2. **Code Reusability**: Shared packages (`ui`, `database`, `storage`) reduce duplication
3. **Type Safety**: Strict TypeScript with Zod validation at runtime
4. **Scalability**: Designed for horizontal scaling with stateless architecture
5. **Security-First**: RBAC, RLS policies, input validation, and audit logging

### **Data Flow**

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Client    │────▶│  Next.js     │────▶│  Supabase    │
│  (Browser)  │◀────│  App Router  │◀────│  PostgreSQL  │
└─────────────┘     └──────────────┘     └──────────────┘
                           │
                           ├────▶ Supabase Auth (SSR)
                           │
                           ├────▶ Server Actions
                           │      (Paper submission, CRUD)
                           │
                           └────▶ Storage Package
                                  ├─▶ Supabase Storage (Hot)
                                  └─▶ Cloudflare R2 (Cold)
```

---

## 🗄️ Database

### **Schema Overview**

The database uses **Prisma ORM** with PostgreSQL (hosted on Supabase).

#### **Core Models**

- **User**: Stores user accounts with role-based permissions
  - `id`, `email`, `name`, `role` (DEAN, EDITOR, REVIEWER, AUTHOR)
  - `created_at`, `updated_at`

- **Paper**: Research paper submissions
  - `id`, `title`, `abstract`, `keywords`, `authors`
  - `status` (DRAFT, UNDER_REVIEW, ACCEPTED, PUBLISHED, REJECTED)
  - `doi`, `file_url`, `submitted_at`, `published_at`

- **Event**: Conference and workshop events
  - `id`, `title`, `description`, `start_date`, `end_date`
  - `location`, `registration_url`, `max_attendees`

- **AuditLog**: Comprehensive audit trail
  - `id`, `user_id`, `action`, `resource`, `metadata`
  - `ip_address`, `timestamp`

- **Review**: Paper review records
  - `id`, `paper_id`, `reviewer_id`, `rating`, `comments`
  - `status`, `submitted_at`

### **Migrations**

```bash
# Create a new migration
pnpm db:migrate:dev

# Apply migrations in production
pnpm db:migrate:deploy

# Reset database (⚠️ DESTRUCTIVE)
pnpm db:reset
```

### **Seeding**

```bash
# Seed database with sample data
pnpm db:seed
```

Seeds include:
- Sample users (one per role)
- 10+ research papers
- Upcoming/past events
- Research guides

---

## 💾 Storage System

### **Dual-Tier Architecture**

ICTIRC implements a **hot/cold storage strategy** for cost optimization:

#### **Hot Storage (Supabase)**
- **Purpose**: Active manuscripts (recently uploaded, frequently accessed)
- **TTL**: Papers accessed within last 90 days
- **Advantages**: Fast retrieval, CDN integration, RLS policies

#### **Cold Storage (Cloudflare R2)**
- **Purpose**: Archived papers (older, infrequently accessed)
- **TTL**: Papers older than 90 days with low access count
- **Advantages**: S3-compatible, $0.015/GB/month, no egress fees

### **Storage Package API**

```typescript
import { 
  uploadToHotStorage, 
  uploadToR2, 
  getR2SignedUrl 
} from '@ictirc/storage';

// Upload to Supabase (hot)
const result = await uploadToHotStorage({
  file: manuscriptFile,
  bucket: 'manuscripts',
  path: 'papers/2026/paper-123.pdf',
  userId: 'user-id'
});

// Archive to R2 (cold)
await uploadToR2({
  file: manuscriptFile,
  key: 'archive/2025/paper-123.pdf',
  metadata: { doi: '10.1234/ictirc.2025.123' }
});

// Generate pre-signed URL (valid for 1 hour)
const url = await getR2SignedUrl('archive/2025/paper-123.pdf', 3600);
```

### **Migration Strategy**

Automatic migration from hot → cold storage based on:
1. **Age**: Papers published >90 days ago
2. **Access Frequency**: <10 downloads per month
3. **User Role**: Papers from non-active authors

> **Note**: Migration is handled by a cron job (see `packages/storage/README.md`)

---

## 🔐 RBAC & Authentication

### **Role Hierarchy**

```
DEAN (Level 3)
  └─▶ Full system access
       └─▶ User management, system settings, all papers

EDITOR (Level 2)
  └─▶ Editorial control
       └─▶ Review management, paper status, user invites

REVIEWER (Level 1)
  └─▶ Review permissions
       └─▶ Assigned papers, submit reviews

AUTHOR (Level 0)
  └─▶ Basic access
       └─▶ Submit papers, view own submissions
```

### **Permission Model**

Permissions are enforced at **three levels**:

#### **1. Middleware (Route-Level)**
```typescript
// apps/admin/middleware.ts
export async function middleware(request: NextRequest) {
  const user = await getCurrentUser();
  
  if (request.nextUrl.pathname.startsWith('/dashboard/system')) {
    return requireRole(user, 'DEAN');
  }
  
  if (request.nextUrl.pathname.startsWith('/dashboard/users')) {
    return requireRole(user, 'EDITOR');
  }
  
  // ...
}
```

#### **2. Server Actions (Operation-Level)**
```typescript
// apps/admin/src/app/dashboard/papers/actions.ts
export async function updatePaperStatus(paperId: string, status: string) {
  const user = await getCurrentUser();
  
  if (!hasPermission(user, 'papers.update')) {
    throw new Error('Insufficient permissions');
  }
  
  // ...
}
```

#### **3. Database (Row-Level Security)**
```sql
-- Supabase RLS policy
CREATE POLICY "Users can only view their own papers"
ON papers FOR SELECT
USING (
  auth.uid() = author_id OR
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('DEAN', 'EDITOR', 'REVIEWER')
  )
);
```

### **Authentication Flow**

1. User logs in via Supabase Auth (email/password or OAuth)
2. Supabase returns JWT with `user_id`
3. Middleware fetches user role from database
4. Role is cached in session for subsequent requests
5. Each protected route/action verifies role before execution

---

## 💻 Development

### **Available Scripts**

```bash
# Development
pnpm dev              # Run all apps in dev mode
pnpm dev:web          # Run web app only
pnpm dev:admin        # Run admin app only

# Build
pnpm build            # Build all apps
pnpm build:web        # Build web app
pnpm build:admin      # Build admin app

# Database
pnpm db:generate      # Generate Prisma Client
pnpm db:migrate       # Run migrations
pnpm db:migrate:dev   # Create & apply migration
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio

# Type Checking
pnpm type-check       # Check TypeScript errors

# Linting
pnpm lint             # Lint all packages
pnpm lint:fix         # Auto-fix linting issues

# Testing (when implemented)
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
```

### **Adding a New Package**

```bash
# Create package directory
mkdir -p packages/your-package/src

# Create package.json
cat > packages/your-package/package.json << EOF
{
  "name": "@ictirc/your-package",
  "version": "0.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {}
}
EOF

# Create tsconfig.json
cat > packages/your-package/tsconfig.json << EOF
{
  "extends": "@ictirc/config/typescript.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}
EOF

# Install dependencies
pnpm install
```

### **Code Style Guidelines**

- **TypeScript**: Strict mode enabled, no implicit any
- **Components**: Prefer Server Components unless client interactivity needed
- **Imports**: Use `@` alias for app imports, full package names for monorepo
- **Naming**: 
  - Components: `PascalCase`
  - Files: `kebab-case.tsx`
  - Functions: `camelCase`
- **Accessibility**: All interactive elements must have accessible names (aria-label)

---

## 🚀 Deployment

### **Vercel (Recommended)**

#### **1. Connect Repository**
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Click "New Project" → Import Git Repository
- Select `CICTstudcoDingle/ictirc`

#### **2. Configure Projects**

**Web App (`apps/web`)**
```
Framework Preset: Next.js
Root Directory: apps/web
Build Command: cd ../.. && pnpm build:web
Output Directory: .next (default)
Install Command: pnpm install
```

**Admin App (`apps/admin`)**
```
Framework Preset: Next.js
Root Directory: apps/admin
Build Command: cd ../.. && pnpm build:admin
Output Directory: .next (default)
Install Command: pnpm install
```

#### **3. Set Environment Variables**

Add all variables from `.env.local` files to Vercel:
- Navigate to Project Settings → Environment Variables
- Add each variable from [Environment Setup](#-environment-setup)
- Select environment: Production, Preview, Development

#### **4. Deploy**

```bash
# Using Vercel CLI
pnpm dlx vercel --prod

# Or push to main branch (auto-deploys)
git push origin main
```

### **Database Migrations**

Run migrations before deploying:

```bash
# Production migration
DATABASE_URL="your-production-url" pnpm db:migrate:deploy
```

### **Custom Domain**

1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `ictirc.cict.ub.ac.id`)
3. Update DNS records as instructed
4. Enable HTTPS (automatic with Vercel)

---

## 📚 API Documentation

### **Public API Routes**

#### **GET `/api/events`**
Fetch upcoming and past events.

**Query Parameters:**
- `status` (optional): `upcoming` | `past` | `all`
- `limit` (optional): Number of results (default: 10)

**Response:**
```json
{
  "upcoming": [
    {
      "id": "evt_123",
      "title": "ICTIRC 2026",
      "start_date": "2026-08-15T00:00:00Z",
      "end_date": "2026-08-17T00:00:00Z",
      "location": "Malang, Indonesia",
      "days_until": 196
    }
  ],
  "past": [...]
}
```

#### **GET `/api/guides`**
Fetch research guides.

**Response:**
```json
{
  "guides": [
    {
      "id": "guide_1",
      "title": "Paper Submission Guidelines",
      "category": "SUBMISSION",
      "content": "...",
      "order": 1
    }
  ]
}
```

### **Admin API Routes** (Requires Authentication)

#### **GET `/api/dashboard`**
Fetch dashboard statistics.

**Headers:**
- `Authorization`: Bearer token from Supabase Auth

**Response:**
```json
{
  "stats": {
    "total_papers": 245,
    "papers_under_review": 12,
    "total_users": 89,
    "upcoming_events": 3
  }
}
```

#### **POST `/api/users` (EDITOR+ only)**
Create a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "role": "REVIEWER"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "usr_456",
    "email": "user@example.com",
    "invite_token": "inv_abc123"
  }
}
```

### **Server Actions**

#### **`submitPaper(formData: FormData)`**
Submit a new research paper.

**Location:** `apps/web/src/app/submit/actions/submit-paper.ts`

**Fields:**
- `title`: string (required)
- `abstract`: string (required, min 150 chars)
- `keywords`: string (comma-separated)
- `authors`: string (JSON array)
- `manuscript`: File (PDF, max 10MB)

**Returns:**
```typescript
{
  success: boolean;
  paper?: { id: string; title: string };
  error?: string;
}
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### **Getting Started**

1. **Fork the repository**
   ```bash
   gh repo fork CICTstudcoDingle/ictirc
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the [Code Style Guidelines](#development)
   - Add tests (when testing framework is set up)
   - Update documentation if needed

4. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
   
   Use [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Go to the [original repository](https://github.com/CICTstudcoDingle/ictirc)
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

### **Pull Request Guidelines**

- **Title**: Clear and descriptive (e.g., "Add email notification for paper acceptance")
- **Description**: Explain what changes you made and why
- **Screenshots**: Include for UI changes
- **Breaking Changes**: Clearly mark any breaking changes
- **Tests**: Ensure all tests pass (when implemented)

### **Code Review Process**

1. Maintainers review your PR within 48 hours
2. Address any requested changes
3. Once approved, a maintainer will merge your PR
4. Your contribution will be included in the next release! 🎉

### **Reporting Issues**

Found a bug or have a feature request?

1. Check [existing issues](https://github.com/CICTstudcoDingle/ictirc/issues)
2. If not found, [create a new issue](https://github.com/CICTstudcoDingle/ictirc/issues/new)
3. Use the appropriate template (Bug Report or Feature Request)
4. Provide as much detail as possible

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **CICT Department, Universitas Brawijaya** for project sponsorship
- **Supabase** for database and authentication infrastructure
- **Vercel** for hosting and deployment platform
- **Cloudflare** for R2 storage services
- **Open Source Community** for the amazing tools and libraries

---

## 📞 Contact & Support

- **Email**: cict@ub.ac.id
- **Website**: https://ictirc.cict.ub.ac.id
- **GitHub Issues**: [Report a bug](https://github.com/CICTstudcoDingle/ictirc/issues)
- **Documentation**: [Full Docs](https://docs.ictirc.cict.ub.ac.id) *(coming soon)*

---

<div align="center">

**Built with ❤️ by the CICT Development Team**

⭐ Star us on GitHub — it helps!

[Report Bug](https://github.com/CICTstudcoDingle/ictirc/issues) • [Request Feature](https://github.com/CICTstudcoDingle/ictirc/issues)

</div>
