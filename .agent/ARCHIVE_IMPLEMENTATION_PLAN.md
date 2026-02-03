# ICTIRC Archive System Implementation Plan

**Created:** February 3, 2026  
**Purpose:** Add archive functionality for past conference proceedings with Volume/Issue management  
**Agent:** Archive & Publication Management

---

## 📋 Executive Summary

This implementation plan establishes a comprehensive archive system for past ICTIRC conference proceedings. The system enables admins to batch upload previously published research papers organized by volumes and issues, with enhanced discovery through Algolia indexing.

### Key Information from 1st ICTIRC (April 2025)

- **Conference:** 1st ICT International Research Colloquium (ICTIRC)
- **Date:** April 25, 2025
- **Location:** Barotac Nuevo, Philippines (ISUFST Main Campus, CICT Techno Hub)
- **Volume:** Volume 4, Issue 1, April 2025
- **ISSN:** 2960-3773
- **Publisher:** Iloilo State University of Fisheries, Science and Technology (ISUFST)
- **Partners:** University of Brawijaya, Indonesia
- **Total Papers:** 20 research papers
- **Theme:** "Resilience and Adaptation: Research for a More Equitable and Secure World"

### Categories (4 Total)

1. **AI and Robotics**
2. **Computer Networking and Internet of Things (IoT)**
3. **Web and Mobile**
4. **Software Development**

---

## 🎯 Goals & Objectives

### Primary Goals

1. **Archive Management**
   - Enable batch upload of historical conference papers
   - Direct publish workflow (bypass review process)
   - Support PDF and DOCX file formats

2. **Volume/Issue Structure**
   - One volume per year (flexible for multiple issues)
   - Link volumes/issues to specific conferences
   - Track publication metadata (ISSN, date, theme)

3. **Enhanced Discovery**
   - Integrate with existing archive section
   - Default view: volumes/issues organized by month
   - Advanced filtering: year, category, topic
   - Full-text search via Algolia (separate agent task)

4. **Admin Interface**
   - Admin-only access for archive management
   - Batch upload functionality
   - Volume/Issue management dashboard

---

## 🗄️ Database Schema Changes

### New Models

#### 1. Volume Model

```prisma
model Volume {
  id          String   @id @default(cuid())
  volumeNumber Int                      // e.g., 4, 5, 6
  year        Int                       // e.g., 2025, 2026
  description String?  @db.Text         // Optional description
  coverImageUrl String?                 // Optional cover image
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  issues      Issue[]
  
  @@unique([volumeNumber, year])
  @@index([year])
  @@index([volumeNumber])
}
```

#### 2. Issue Model

```prisma
model Issue {
  id           String    @id @default(cuid())
  issueNumber  Int                      // e.g., 1, 2
  month        String?                  // e.g., "April", "March"
  publishedDate DateTime                // Actual publication date
  issn         String?                  // e.g., "2960-3773"
  theme        String?   @db.Text       // Conference theme
  description  String?   @db.Text
  coverImageUrl String?                 // Optional cover image
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  // Relations
  volume       Volume    @relation(fields: [volumeId], references: [id], onDelete: Cascade)
  volumeId     String
  conference   Conference? @relation(fields: [conferenceId], references: [id])
  conferenceId String?
  papers       ArchivedPaper[]

  @@unique([volumeId, issueNumber])
  @@index([volumeId])
  @@index([conferenceId])
  @@index([publishedDate])
}
```

#### 3. Conference Model

```prisma
model Conference {
  id          String   @id @default(cuid())
  name        String                    // e.g., "1st ICTIRC"
  fullName    String?  @db.Text         // e.g., "1st ICT International Research Colloquium"
  date        DateTime                  // Conference date
  location    String?                   // e.g., "Barotac Nuevo, Philippines"
  venue       String?  @db.Text         // e.g., "CICT Techno Hub, ISUFST Main Campus"
  theme       String?  @db.Text
  organizers  String[] @default([])     // Array of organizing institutions
  partners    String[] @default([])     // Array of partner institutions
  logoUrl     String?
  websiteUrl  String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  issues      Issue[]

  @@index([date])
}
```

#### 4. ArchivedPaper Model

```prisma
model ArchivedPaper {
  id             String    @id @default(cuid())
  title          String
  abstract       String    @db.Text
  keywords       String[]
  doi            String?   @unique          // Can be assigned later
  pdfUrl         String                     // Required for archived papers
  docxUrl        String?                    // Optional source file
  pageStart      Int?                       // Starting page in issue
  pageEnd        Int?                       // Ending page in issue
  
  // Publication metadata
  publishedDate  DateTime                   // When originally published
  submittedDate  DateTime?                  // Original submission date
  acceptedDate   DateTime?                  // Original acceptance date
  
  // File upload tracking
  uploadedAt     DateTime  @default(now())
  uploadedBy     String                     // Admin user ID
  
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  // Relations
  authors        ArchivedPaperAuthor[]
  category       Category  @relation(fields: [categoryId], references: [id])
  categoryId     String
  issue          Issue     @relation(fields: [issueId], references: [id], onDelete: Cascade)
  issueId        String
  uploader       User      @relation(fields: [uploadedBy], references: [id])

  @@index([issueId])
  @@index([categoryId])
  @@index([publishedDate])
  @@index([uploadedAt])
}
```

#### 5. ArchivedPaperAuthor Model

```prisma
model ArchivedPaperAuthor {
  id             String  @id @default(cuid())
  name           String                     // Author full name
  email          String?                    // Optional email
  affiliation    String?                    // Institution
  order          Int     @default(0)        // Author order in paper
  isCorresponding Boolean @default(false)   // Corresponding author flag

  // Relations
  paper          ArchivedPaper @relation(fields: [paperId], references: [id], onDelete: Cascade)
  paperId        String

  @@index([paperId])
  @@index([email])
}
```

### Schema Updates to Existing Models

#### Update User Model

Add relation to archived papers:

```prisma
model User {
  // ... existing fields ...
  
  // Add new relation
  uploadedArchives ArchivedPaper[]
}
```

#### Update Category Model

Add relation to archived papers:

```prisma
model Category {
  // ... existing fields ...
  
  // Add new relation
  archivedPapers ArchivedPaper[]
}
```

---

## 🎨 Admin Interface Design

### 1. Archive Dashboard (`/admin/dashboard/archives`)

**Features:**
- Overview statistics (total volumes, issues, papers)
- Recent uploads
- Quick actions (Create Volume, Create Issue, Batch Upload)

**Components:**
- `ArchiveStats.tsx` - Statistics cards
- `ArchiveOverview.tsx` - Main dashboard layout
- `RecentUploads.tsx` - List of recently uploaded papers

### 2. Volume Management (`/admin/dashboard/archives/volumes`)

**Features:**
- List all volumes
- Create new volume
- Edit/Delete volume
- View issues within volume

**Components:**
- `VolumeList.tsx` - Data table of volumes
- `VolumeForm.tsx` - Create/Edit volume form
- `VolumeCard.tsx` - Volume display card

### 3. Issue Management (`/admin/dashboard/archives/issues`)

**Features:**
- List all issues (filterable by volume)
- Create new issue
- Edit/Delete issue
- View papers within issue

**Components:**
- `IssueList.tsx` - Data table of issues
- `IssueForm.tsx` - Create/Edit issue form
- `IssueCard.tsx` - Issue display card

### 4. Batch Upload Interface (`/admin/dashboard/archives/upload`)

**Features:**
- Multi-file upload (PDF + optional DOCX)
- CSV/Excel template for metadata import
- Drag-and-drop interface
- Bulk metadata entry form
- Preview before publish
- Direct publish to archive

**Components:**
- `BatchUploadZone.tsx` - Drag-drop file upload
- `MetadataImporter.tsx` - CSV/Excel import
- `PaperMetadataForm.tsx` - Individual paper form
- `BatchPreview.tsx` - Review all papers before publish
- `UploadProgress.tsx` - Upload status tracker

**Batch Upload Flow:**
1. Select target Issue (or create new)
2. Upload files (PDF required, DOCX optional)
3. Import metadata via CSV or manual entry
4. Map authors (name, email, affiliation, order)
5. Preview all papers
6. Publish to archive

**CSV Template Structure:**
```csv
title,abstract,keywords,category,page_start,page_end,pdf_filename,docx_filename,author_1_name,author_1_email,author_1_affiliation,author_2_name,author_2_email,author_2_affiliation,submitted_date,accepted_date
"Paper Title Here","Abstract text...","keyword1;keyword2;keyword3","AI and Robotics",1,10,paper1.pdf,paper1.docx,"John Doe","john@example.com","University A","Jane Smith","jane@example.com","University B",2025-03-01,2025-04-10
```

### 5. Individual Paper Management

**Features:**
- Edit paper metadata
- Update files
- Assign/update DOI
- View/Edit authors
- Delete paper

**Components:**
- `ArchivedPaperEdit.tsx` - Edit form
- `AuthorManager.tsx` - Manage paper authors

---

## 🌐 Public Archive Display Updates

### Current Archive Page Enhancements

**Location:** `/apps/web/src/app/archive/page.tsx`

#### New Default View: Volume/Issue Browser

**Layout Options:**
1. **Timeline View (Default)**
   - Organized by year
   - Show volumes with nested issues
   - Display issue cards with paper count
   - Month-based sorting

2. **Grid View**
   - Issue cards in grid layout
   - Cover images (if available)
   - Key metadata (volume, issue, date, paper count)

**Components:**
- `VolumeTimeline.tsx` - Timeline of volumes by year
- `IssueGrid.tsx` - Grid layout of issues
- `IssueCard.tsx` - Individual issue display
- `VolumeSection.tsx` - Collapsible volume section

#### Enhanced Filters

**Filter Options:**
1. **View Mode:** Timeline / Grid / List
2. **Year:** All / 2025 / 2026 / etc.
3. **Category:** All / AI and Robotics / Computer Networking / etc.
4. **Search:** Full-text search (integrate with Algolia)

**Components:**
- `ArchiveViewToggle.tsx` - Switch between views
- `YearFilter.tsx` - Filter by year
- `CategoryFilter.tsx` - Filter by category (existing, enhanced)
- `ArchiveSearch.tsx` - Search input with Algolia integration

#### Issue Detail View (`/archive/volume/[volumeId]/issue/[issueId]`)

**Features:**
- Issue metadata display
- List of papers in issue
- Download entire issue (future)
- Citation export

**Components:**
- `IssueDetail.tsx` - Issue information
- `IssuePaperList.tsx` - Papers in issue
- `IssueCitation.tsx` - Citation formats

#### Paper Detail Updates

**Enhancements:**
- Display Volume/Issue information
- Link to issue page
- Show page numbers in issue
- Enhanced citation with volume/issue

---

## 🔧 API Endpoints & Server Actions

### Admin Actions

#### Volume Management

**Location:** `/apps/admin/src/app/api/archives/volumes/actions.ts`

```typescript
// Create volume
export async function createVolume(data: VolumeInput): Promise<Volume>

// Update volume
export async function updateVolume(id: string, data: VolumeInput): Promise<Volume>

// Delete volume
export async function deleteVolume(id: string): Promise<void>

// Get volume with issues
export async function getVolumeWithIssues(id: string): Promise<VolumeWithIssues>

// List all volumes
export async function listVolumes(): Promise<Volume[]>
```

#### Issue Management

**Location:** `/apps/admin/src/app/api/archives/issues/actions.ts`

```typescript
// Create issue
export async function createIssue(data: IssueInput): Promise<Issue>

// Update issue
export async function updateIssue(id: string, data: IssueInput): Promise<Issue>

// Delete issue
export async function deleteIssue(id: string): Promise<void>

// Get issue with papers
export async function getIssueWithPapers(id: string): Promise<IssueWithPapers>

// List issues by volume
export async function listIssuesByVolume(volumeId: string): Promise<Issue[]>
```

#### Batch Upload

**Location:** `/apps/admin/src/app/api/archives/batch-upload/actions.ts`

```typescript
// Upload files to storage
export async function uploadArchiveFiles(
  files: File[],
  issueId: string
): Promise<UploadResult[]>

// Parse metadata CSV
export async function parseMetadataCSV(file: File): Promise<PaperMetadata[]>

// Batch create archived papers
export async function batchCreateArchivedPapers(
  papers: ArchivedPaperInput[],
  issueId: string,
  uploaderId: string
): Promise<ArchivedPaper[]>

// Validate batch data
export async function validateBatchData(
  papers: ArchivedPaperInput[]
): Promise<ValidationResult>
```

#### Conference Management

**Location:** `/apps/admin/src/app/api/archives/conferences/actions.ts`

```typescript
// Create conference
export async function createConference(data: ConferenceInput): Promise<Conference>

// Update conference
export async function updateConference(id: string, data: ConferenceInput): Promise<Conference>

// Get conference with issues
export async function getConferenceWithIssues(id: string): Promise<ConferenceWithIssues>
```

### Public API

#### Archive Data

**Location:** `/apps/web/src/app/api/archive/route.ts`

```typescript
// Get volumes with issues (for timeline view)
GET /api/archive/volumes?year=2025

// Get issue details with papers
GET /api/archive/issues/[issueId]

// Get papers by issue
GET /api/archive/issues/[issueId]/papers

// Search archived papers (Algolia integration)
GET /api/archive/search?q=query&year=2025&category=AI
```

---

## 📦 Storage Structure

### Cloudflare R2 / Supabase Storage

#### Directory Organization

```
archives/
  volume-4/
    issue-1/
      papers/
        paper-1-doe-2025.pdf
        paper-1-doe-2025.docx
        paper-2-smith-2025.pdf
        paper-2-smith-2025.docx
        ...
      cover.jpg
  volume-5/
    issue-1/
      papers/
        paper-1-johnson-2026.pdf
        ...
```

#### Naming Convention

- **PDF:** `paper-{order}-{lastname}-{year}.pdf`
- **DOCX:** `paper-{order}-{lastname}-{year}.docx`
- **Covers:** `cover.jpg` or `cover.png`

---

## 🔍 Algolia Integration (Separate Agent Task)

### Index Structure

**Index Name:** `ictirc_archived_papers`

**Indexed Fields:**
- title
- abstract
- keywords
- authors (names, affiliations)
- category
- volume
- issue
- publishedDate
- doi

**Facets:**
- year
- category
- volume
- issue
- authors

**Ranking Criteria:**
1. Text relevance
2. Publication date (recent first)
3. Custom ranking (featured papers)

---

## 🔐 Permissions & Security

### Admin Only

- All archive management operations
- Volume/Issue CRUD
- Batch upload
- Conference management

### Public Access

- View all published archives
- Search and filter
- Download papers
- View citations

### RBAC Rules

```typescript
// apps/admin/src/lib/rbac.ts

export const archivePermissions = {
  'archive:volume:create': ['SUPER_ADMIN', 'ADMIN'],
  'archive:volume:update': ['SUPER_ADMIN', 'ADMIN'],
  'archive:volume:delete': ['SUPER_ADMIN'],
  'archive:issue:create': ['SUPER_ADMIN', 'ADMIN'],
  'archive:issue:update': ['SUPER_ADMIN', 'ADMIN'],
  'archive:issue:delete': ['SUPER_ADMIN'],
  'archive:paper:upload': ['SUPER_ADMIN', 'ADMIN'],
  'archive:paper:update': ['SUPER_ADMIN', 'ADMIN'],
  'archive:paper:delete': ['SUPER_ADMIN'],
  'archive:conference:manage': ['SUPER_ADMIN', 'ADMIN'],
};
```

---

## 📊 Data Migration Plan

### Initial Data Load: 1st ICTIRC

#### Step 1: Create Conference Record

```typescript
const conference = {
  name: "1st ICTIRC",
  fullName: "1st ICT International Research Colloquium",
  date: new Date("2025-04-25"),
  location: "Barotac Nuevo, Philippines",
  venue: "CICT Techno Hub, ISUFST Main Campus, Poblacion Site",
  theme: "Resilience and Adaptation: Research for a More Equitable and Secure World",
  organizers: [
    "Office of Internationalization and Linkages, ISUFST",
    "Research and Development, ISUFST",
    "College on Information and Communications Technology, ISUFST"
  ],
  partners: ["University of Brawijaya"],
};
```

#### Step 2: Create Volume & Issue

```typescript
const volume = {
  volumeNumber: 4,
  year: 2025,
  description: "Volume 4 - 2025",
};

const issue = {
  issueNumber: 1,
  month: "April",
  publishedDate: new Date("2025-04-25"),
  issn: "2960-3773",
  theme: "Resilience and Adaptation: Research for a More Equitable and Secure World",
  volumeId: volume.id,
  conferenceId: conference.id,
};
```

#### Step 3: Prepare Categories

Ensure these categories exist:
1. AI and Robotics
2. Computer Networking and Internet of Things (IoT)
3. Web and Mobile
4. Software Development

#### Step 4: Batch Upload 20 Papers

Use batch upload interface with:
- 20 PDF files
- Metadata CSV with author information
- Category assignments
- Page number ranges

---

## 🎯 Implementation Phases

### Phase 1: Database Schema (Week 1)

**Tasks:**
1. Create Prisma migrations for new models
2. Update existing models with relations
3. Run migrations on development database
4. Seed initial conference/volume/issue data
5. Test schema with sample data

**Deliverables:**
- Migration files
- Updated schema.prisma
- Seed script for 1st ICTIRC

### Phase 2: Admin Backend (Week 1-2)

**Tasks:**
1. Implement server actions for volume management
2. Implement server actions for issue management
3. Implement server actions for conference management
4. Implement batch upload actions
5. Add file upload to storage (R2/Supabase)
6. Implement CSV parsing for metadata
7. Add validation logic

**Deliverables:**
- Server action files
- Type definitions
- API routes
- Storage integration

### Phase 3: Admin UI (Week 2-3)

**Tasks:**
1. Create archive dashboard layout
2. Build volume management interface
3. Build issue management interface
4. Build batch upload interface
5. Create metadata CSV template
6. Implement drag-drop file upload
7. Add progress tracking
8. Implement RBAC checks

**Deliverables:**
- Admin pages
- React components
- Forms and validation
- CSV template file

### Phase 4: Public Archive Enhancement (Week 3-4)

**Tasks:**
1. Update archive page with volume/issue view
2. Create timeline view component
3. Create grid view component
4. Add view toggle functionality
5. Enhance filters (year, category)
6. Create issue detail page
7. Update paper detail page
8. Add breadcrumbs and navigation

**Deliverables:**
- Updated archive pages
- New components
- Enhanced filtering
- Issue/volume navigation

### Phase 5: Testing & Data Load (Week 4)

**Tasks:**
1. Test all admin functions
2. Test batch upload with sample data
3. Upload 20 papers from 1st ICTIRC
4. Verify public display
5. Test search and filters
6. Performance testing
7. Security testing (RBAC)

**Deliverables:**
- Test results
- Loaded archive data
- Bug fixes
- Documentation

### Phase 6: Algolia Integration (Week 5 - Separate Agent)

**Note:** To be handled by search/indexing specialist agent

**Tasks:**
1. Set up Algolia index
2. Configure index settings
3. Implement data sync
4. Update search components
5. Add advanced search features

**Deliverables:**
- Algolia configuration
- Search integration
- Enhanced search UI

---

## 📝 File Structure

### New Files to Create

#### Admin App

```
apps/admin/src/
  app/
    dashboard/
      archives/
        page.tsx                         # Archive dashboard
        volumes/
          page.tsx                       # Volume list
          [id]/
            page.tsx                     # Volume detail/edit
          new/
            page.tsx                     # Create volume
        issues/
          page.tsx                       # Issue list
          [id]/
            page.tsx                     # Issue detail/edit
          new/
            page.tsx                     # Create issue
        upload/
          page.tsx                       # Batch upload interface
        conferences/
          page.tsx                       # Conference list
          [id]/
            page.tsx                     # Conference detail/edit
          new/
            page.tsx                     # Create conference
  components/
    archives/
      ArchiveStats.tsx
      ArchiveOverview.tsx
      VolumeList.tsx
      VolumeForm.tsx
      VolumeCard.tsx
      IssueList.tsx
      IssueForm.tsx
      IssueCard.tsx
      BatchUploadZone.tsx
      MetadataImporter.tsx
      PaperMetadataForm.tsx
      BatchPreview.tsx
      UploadProgress.tsx
      ArchivedPaperEdit.tsx
      AuthorManager.tsx
      ConferenceForm.tsx
  lib/
    archives/
      actions.ts                         # Server actions
      validations.ts                     # Zod schemas
      types.ts                           # TypeScript types
      csv-parser.ts                      # CSV parsing logic
```

#### Web App

```
apps/web/src/
  app/
    archive/
      volume/
        [volumeId]/
          page.tsx                       # Volume detail
          issue/
            [issueId]/
              page.tsx                   # Issue detail
  components/
    archive/
      VolumeTimeline.tsx
      IssueGrid.tsx
      IssueCard.tsx
      VolumeSection.tsx
      ArchiveViewToggle.tsx
      YearFilter.tsx
      IssueDetail.tsx
      IssuePaperList.tsx
      IssueCitation.tsx
```

#### Shared Package Updates

```
packages/database/
  prisma/
    migrations/
      [timestamp]_add_archive_models/
        migration.sql
    schema.prisma                        # Updated
  src/
    types/
      archive.ts                         # Archive-related types
```

---

## 🔗 Integration Points

### 1. Storage Package (`@ictirc/storage`)

**Updates Required:**
- Add archive-specific upload functions
- Implement batch upload support
- Add file validation for PDF/DOCX

### 2. Database Package (`@ictirc/database`)

**Updates Required:**
- New models in schema
- Export archive-related types
- Add helper functions for archive queries

### 3. UI Package (`@ictirc/ui`)

**Potential New Components:**
- `FileUploadZone` - Drag-drop file upload
- `CSVImporter` - CSV file import component
- `DataTable` - Enhanced table for admin lists

### 4. SEO Package (`@ictirc/seo`)

**Updates Required:**
- Add metadata generators for issue pages
- Add structured data for archived papers
- Update sitemap to include volume/issue pages

---

## 🧪 Testing Strategy

### Unit Tests

1. **Server Actions**
   - Volume CRUD operations
   - Issue CRUD operations
   - Batch upload logic
   - CSV parsing
   - Data validation

2. **Components**
   - Form validation
   - File upload handling
   - Filter logic

### Integration Tests

1. **Admin Workflow**
   - Create volume → Create issue → Upload papers
   - Batch upload with CSV
   - Edit existing archives

2. **Public Display**
   - Archive page rendering
   - Filtering and search
   - Issue/volume navigation

### E2E Tests

1. Complete admin workflow
2. Public archive browsing
3. Search functionality
4. File downloads

---

## 📈 Success Metrics

### Technical Metrics

- [ ] All 20 papers from 1st ICTIRC successfully uploaded
- [ ] Volume 4, Issue 1 properly configured
- [ ] All paper metadata accurate
- [ ] Files accessible and downloadable
- [ ] Search functionality working
- [ ] Page load time < 2s

### User Experience Metrics

- [ ] Admin can upload 20 papers in < 30 minutes
- [ ] Intuitive volume/issue navigation
- [ ] Effective filtering and search
- [ ] Mobile-responsive design
- [ ] Accessible (WCAG 2.1 AA)

---

## 🚀 Future Enhancements

### Phase 2 Features (Post-Initial Launch)

1. **Bulk Issue Download**
   - Generate PDF with all papers in issue
   - Create ZIP download option

2. **Citation Export**
   - BibTeX export
   - RIS format
   - EndNote format
   - Citation builder

3. **Analytics Dashboard**
   - Download statistics
   - Popular papers
   - Search trends

4. **DOI Management**
   - Bulk DOI assignment
   - DOI validation
   - CrossRef integration

5. **Advanced Metadata**
   - ORCID integration for authors
   - Funding information
   - Research data links

6. **Public Contribution**
   - Author profile pages
   - Citation tracking
   - Related papers suggestions

---

## 📚 References & Resources

### Sample Paper Metadata (from images)

**Paper Example:**
- **Title:** "Comparison of Machine Learning Algorithms for Phishing Detection of Uniform Resource Locators"
- **Authors:** Fritz Noel C. Quilacio¹, Asher Paul M. Cuadra², Raj G. Redaja³, Shane M. Gabaton⁴, Menjoy P. Marinog⁵
- **Affiliations:** ¹²³⁴⁵Guimaras State University
- **Category:** AI/Machine Learning
- **Keywords:** Phishing, Detection, Machine Learning, etc.

### Academic Publishing Standards

- **ISSN Format:** XXXX-XXXX
- **DOI Format:** 10.xxxxx/xxxxx
- **Author Order:** Maintained from original submission
- **Page Numbering:** Continuous within issue

### CSV Template Example

Located at: `/apps/admin/public/templates/archive-metadata-template.csv`

---

## 🤝 Collaboration with Other Agents

### Algolia Indexing Agent

**Handoff Information:**
- Database models: `ArchivedPaper`, `Volume`, `Issue`
- Required indexes: Full-text search on title, abstract, authors
- Facets needed: year, category, volume, issue
- Search UI components location
- API endpoints for search

**Deliverables Expected:**
- Algolia configuration
- Search components
- Real-time indexing setup

---

## ✅ Checklist Before Implementation

- [ ] Review and approve schema design
- [ ] Confirm storage provider (R2 vs Supabase)
- [ ] Verify RBAC permissions structure
- [ ] Approve UI/UX mockups (if needed)
- [ ] Confirm CSV template structure
- [ ] Review file naming conventions
- [ ] Approve initial data (1st ICTIRC details)
- [ ] Coordinate with Algolia agent

---

## 📞 Stakeholder Communication

### Weekly Updates

- Progress on implementation phases
- Blockers or challenges
- Demo of completed features
- Timeline adjustments

### Key Decisions Needed

1. **Storage Provider:** Cloudflare R2 or Supabase Storage?
2. **Cover Images:** Required or optional for issues?
3. **DOI Assignment:** Manual or automated for archives?
4. **Author Linking:** Link to existing Author table or keep separate?

---

## 🎓 Training & Documentation

### Admin User Guide

Topics to cover:
1. Creating volumes and issues
2. Batch upload process
3. CSV template usage
4. Managing archived papers
5. Editing metadata
6. Assigning DOIs

### Developer Documentation

Topics to cover:
1. Archive data models
2. API usage
3. Adding new features
4. Algolia integration
5. Storage operations

---

**End of Implementation Plan**

**Next Steps:**
1. Review and approve this plan
2. Create detailed UI mockups (if required)
3. Begin Phase 1: Database Schema
4. Coordinate with Algolia indexing agent

**Estimated Total Timeline:** 4-5 weeks for core functionality
**Estimated Effort:** 120-150 development hours
