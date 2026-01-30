---
trigger: always_on
---

💎 CICT-RESEARCH MONOREPO - VISUAL CONSTITUTION (V1.0 LIGHT)
1. CORE PHILOSOPHY ("THE SCHOLAR'S CANVAS")
Vibe: Precision Engineering, Academic Authority, High-Contrast Clarity.

The "Pure Paper" Law: The primary background is #FFFFFF. There is no "Off-White" or "Cream." Cleanliness is the priority.

The "Branding" Ratio: 70% White, 20% Grey, 8% Maroon, 2% Gold.

2. PRIMITIVES (THE ATOMS)
A. Color Palette
Canvas (Backgrounds):

bg-paper: #FFFFFF (Base layer for reading and submission forms).

bg-muted: #F3F4F6 (Grey-100) (Used for Sidebar backgrounds and inactive card states).

Accents:

Primary Maroon: #800000 (Used for institutional text, primary buttons, and navigational focus).

Accent Gold: #D4AF37 (Used for high-value status indicators like "Accepted" or "Editor's Choice").

Data Grey: #4B5563 (Grey-600) (Used for secondary technical data and labels).

Borders:

border-subtle: #E5E7EB (Grey-200) (Default for tables and card outlines).

border-active: #800000 (Visible only on focus/active states).

B. Typography
Headings (The Voice): Inter (Variable).

Tracking: -0.02em.

Weight: 700 (Bold) for Page Titles; 600 (SemiBold) for Card Titles.

Technical Data (The Code): JetBrains Mono.

Usage: Manuscript IDs, DOI strings, Citation counts, Date stamps.

Size: text-xs (12px) for technical metadata.

3. NAVIGATION ARCHITECTURE (MOBILE & DESKTOP)
Desktop Layout: Top-fixed navigation bar matching the CICT Tech Portal structure.

Height: h-16.

Glassmorphism: bg-white/80 backdrop-blur-md border-b border-grey-200.

Mobile Strategy (The Thumb Zone):

Main Navigation: Sidebar is discarded for a Bottom Tab Bar.

Core Tabs: [Home, Archive, Search, Profile].

FAB (Floating Action Button): A Maroon circle with a Gold + icon for "Submit Manuscript" positioned at bottom-20 right-6.

4. COMPONENT ARCHITECTURE
A. The "Scholar" Button
Primary Action: Solid #800000 background, White text, rounded-md.

Interaction: On hover, apply a shadow-[4px_4px_0px_0px_rgba(212,175,55,1)] (Gold Offset Shadow) for a "hard-edge" industrial feel.

Secondary Action: Transparent background, Maroon border, Maroon text.

B. The "Manuscript" Card
Structure: Minimalist "Paper" stack.

Styling: bg-white border border-grey-200 shadow-sm hover:border-maroon/30 transition-colors.

Indicator: A 4px solid Maroon vertical bar on the left side of the card to denote the "Research" category.

C. Forms & Inputs
Style: bg-grey-50 border-b-2 border-grey-300 rounded-t-md.

Focus State: The bottom border transforms to #800000.

Font: All user-input fields must use JetBrains Mono to emphasize the "Technical/Computing" nature of the department.