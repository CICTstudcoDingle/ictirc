# Changelog

## [1.2.0] - 2026-02-06

### 2026 Conference Updates & Organization Pages

This release adds comprehensive conference information, organizing committee details, and sponsor pages for the 2026 IRCICT conference.

### ✨ Features

#### Added HOME page with 2026 IRCICT conference highlights
Created a dedicated `/home` page featuring comprehensive event details for the 2026 2nd International Research Conference in Information Communications Technology. Includes:
- Conference dates (March 3-4, 2026)
- Hybrid format information (in-person and virtual)
- Venue details at Knowledge Hub Center, ISUFST-Dingle Campus, Dingle, Iloilo, Philippines
- Organizer information (CICT and University of Brawijaya, Indonesia)
- RASUC endorsement badge
- Call-to-action sections for research submission
- Official contact: irjict@gmail.com

#### Added Organizing Committee page
Created `/committees` page displaying the complete 2026 organizing committee structure including:
- **Overall Chair**: Dr. Renante A. Diamante
- **Secretariat**: Teddy S. Fuentivilla, MIT; Rowena S. Borcelo, MPA; Jezza Mae V. Catiquesta
- **Co-chair**: Dr. Muhammad Ali Fauzi
- **IT Chair**: Dr. Glenn C. Tabia
- **IT Co-chair**: Rebie L. Danitaras, MIT
- **Technical Chair**: Renly S. Jade Laud, MIT
- **Technical Co-Chair**: Ric John Puying
- **Research Facilitator**: Dr. Glenn Dador
- **Research Co-Facilitator**: Shayla Bendaña
- **Publicity Chair**: Dr. Benjamin L. Cornelio, Jr.
- **Publicity Co-chair**: Jeff Edrick Martinez

Contact: irjict@gmail.com

#### Added Sponsors & Partners page
Created `/sponsors` page showcasing conference organizers and partners:
- **Primary Organizer**: College of Information and Communications Technology (CICT), ISUFST-Dingle Campus
- **Major Partner**: University of Brawijaya, Malang, Indonesia
- **In Cooperation With**:
  - International Linkages Affairs Office, ISUFST-Dingle Campus
  - Research and Development, ISUFST-Dingle Campus
  - Regional State Universities and Colleges Association (RASUC) - Conference Endorsement
- Includes sponsor inquiry call-to-action

### 🚀 Enhancements

#### Updated navigation with ORGANIZATION dropdown menu
Enhanced desktop navigation with:
- New HOME link as first navigation item
- ORGANIZATION dropdown containing:
  - Committees
  - Sponsors
- Hover-based dropdown with smooth animations
- Proper z-indexing for layered UI

#### Updated mobile navigation menu
Redesigned mobile navigation to include:
- HOME link
- Committees (with Users icon)
- Sponsors (with Award icon)
- Updated active state logic to support the new `/home` route

### 🐛 Bug Fixes

#### Fixed R2 connection configuration
Resolved R2 bucket connection issues:
- Removed incorrect quotes from `R2_BUCKET_NAME_COLD` environment variable across all .env files:
  - apps/admin/.env.local
  - apps/author/.env.local
  - apps/web/.env.local
  - packages/database/.env
- Updated default bucket name from `cict-cold-storage` to `ictirc`
- Corrected .env.example files to show proper format (without quotes)

---

## Conference Details

**2026 2nd International Research Conference in Information Communications Technology (IRCICT)**

- **Date**: March 3-4, 2026
- **Venue**: Knowledge Hub Center, ISUFST-Dingle Campus, Dingle, Iloilo, Philippines
- **Format**: Hybrid (In-person and Virtual)
- **Status**: Approved and Endorsed by RASUC (Regional State Universities and Colleges Association)
- **Contact**: irjict@gmail.com

**Organizers**:
- College of Information and Communications Technology (CICT), ISUFST-Dingle Campus
- University of Brawijaya, Malang, Indonesia

**Supporting Organizations**:
- International Linkages Affairs Office, ISUFST-Dingle Campus
- Research and Development, ISUFST-Dingle Campus
- Regional State Universities and Colleges Association (RASUC)
