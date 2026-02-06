# How to Add Changelog Entries to Database

The changelog entries for the February 2026 updates have been documented in `CHANGELOG-FEB-2026.md`.

To add these to the database changelog visible at `/changelog`:

## Option 1: Using Admin Dashboard (Recommended)

1. Log into the admin portal at `http://localhost:3001`
2. Navigate to Dashboard → Changelog (or create this section if it doesn't exist)
3. Create a new release:
   - **Version**: 1.2.0
   - **Version Type**: MINOR
   - **Title**: 2026 Conference Updates & Organization Pages
   - **Description**: Added comprehensive conference information, organizing committee details, and sponsor pages for the 2026 IRCICT conference.
   - **Release Date**: 2026-02-06
   - **Published**: ✓ Yes

4. Add the following changelog entries:

### Entry 1: (FEATURE)
- **Title**: Added HOME page with 2026 IRCICT conference highlights
- **Description**: Created a dedicated /home page featuring comprehensive event details for the 2026 2nd International Research Conference in Information Communications Technology. Includes conference dates (March 3-4, 2026), hybrid format information, venue details at Knowledge Hub Center ISUFST-Dingle Campus, organizer information (CICT and University of Brawijaya), RASUC endorsement badge, and call-to-action sections for research submission.
- **Change Type**: FEATURE
- **Order**: 1

### Entry 2: (FEATURE)
- **Title**: Added Organizing Committee page
- **Description**: Created /committees page displaying the complete 2026 organizing committee structure including Overall Chair (Dr. Renante A. Diamante), Secretariat team, IT leadership, Technical chairs, Research facilitators, and Publicity team. Includes official contact email (irjict@gmail.com).
- **Change Type**: FEATURE
- **Order**: 2

### Entry 3: (FEATURE)
- **Title**: Added Sponsors & Partners page
- **Description**: Created /sponsors page showcasing conference organizers and partners including CICT ISUFST-Dingle Campus as primary organizer, University of Brawijaya Indonesia as major partner, and supporting organizations (International Linkages Affairs Office, R&D, RASUC). Includes sponsor inquiry call-to-action.
- **Change Type**: FEATURE
- **Order**: 3

### Entry 4: (ENHANCEMENT)
- **Title**: Updated navigation with ORGANIZATION dropdown menu
- **Description**: Enhanced desktop navigation with new ORGANIZATION dropdown containing links to Committees and Sponsors pages. Added HOME link as first navigation item. Implemented hover-based dropdown with smooth animations and proper z-indexing.
- **Change Type**: ENHANCEMENT
- **Order**: 4

### Entry 5: (ENHANCEMENT)
- **Title**: Updated mobile navigation menu
- **Description**: Redesigned mobile navigation to include HOME link, Committees, and Sponsors as dedicated menu items. Added appropriate icons (Users for Committees, Award for Sponsors) and updated active state logic to support the new /home route.
- **Change Type**: ENHANCEMENT
- **Order**: 5

### Entry 6: (BUGFIX)
- **Title**: Fixed R2 connection configuration
- **Description**: Resolved R2 bucket connection issues by removing incorrect quotes from R2_BUCKET_NAME_COLD environment variable across all .env files (admin, author, web, database). Updated default bucket name from 'cict-cold-storage' to 'ictirc' and corrected .env.example files.
- **Change Type**: BUGFIX
- **Order**: 6

## Option 2: Using the Database Script

Once tsx is properly installed, run:

```bash
pnpm tsx packages/database/scripts/add-feb-2026-changelog.ts
```

The script is located at: `packages/database/scripts/add-feb-2026-changelog.ts`

## Verification

After adding, visit `/changelog` on the website to verify the entries appear correctly.
