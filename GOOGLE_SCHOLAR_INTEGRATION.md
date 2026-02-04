# Google Scholar Integration Guide

## ✅ Implementation Status

### **Phase 1: Critical Fixes** - COMPLETED ✓

All essential Google Scholar integration requirements have been implemented:

#### 1. **Sitemap Fixed** ✓
- **Before**: Queried `Paper` table (submission workflow - not published)
- **After**: Queries `ArchivedPaper` table (published papers in volumes/issues)
- **Added**: Volume pages, Issue pages, and all paper pages
- **File**: `apps/web/src/app/sitemap.ts`

#### 2. **SEO Metadata Enhanced** ✓
- **Journal Title**: "Journal of ICTIRC - ISUFST Vol X, Issue Y"
- **ISSN**: Included in all citation metadata (when available)
- **Volume/Issue Info**: citation_volume, citation_issue, citation_firstpage, citation_lastpage
- **Conference Info**: citation_conference_title (when paper is linked to conference)
- **ORCID Support**: Ready for author ORCID identifiers
- **File**: `packages/seo/src/metadata.ts`

#### 3. **Paper Pages Updated** ✓
- **Metadata**: Passes volume, issue, ISSN, conference info to SEO package
- **JSON-LD**: Structured data includes full publication hierarchy
- **File**: `apps/web/src/app/archive/[id]/page.tsx`

---

## 📋 Google Scholar Requirements Checklist

### ✅ **Already Implemented**
- ✓ robots.txt allows `Googlebot-Scholar`
- ✓ Sitemap includes all published papers
- ✓ Highwire Press meta tags (citation_*)
- ✓ Dublin Core metadata (dc.*)
- ✓ JSON-LD structured data (ScholarlyArticle)
- ✓ OpenGraph tags
- ✓ PDF URLs directly accessible
- ✓ Open Access (no paywall)
- ✓ Individual URLs for each paper
- ✓ Volume/Issue information in metadata
- ✓ ISSN in metadata (when available per issue)
- ✓ Conference linking

### 📝 **Optional Enhancements** (Future)
- ⏳ ORCID field in database (TODO: schema migration needed)
- ⏳ Author profile pages
- ⏳ Search papers by author
- ⏳ Citation counts display
- ⏳ Related papers suggestions

---

## 🚀 How Google Scholar Will Index Your Papers

### **Timeline**
- **Week 1-2**: Sitemap discovered, pages crawled
- **Week 3-4**: Papers appear in Google Scholar search results
- **Ongoing**: New papers indexed within days of publication

### **What Google Scholar Sees**
When Googlebot-Scholar crawls a paper page (e.g., `/archive/paper-id`), it reads:

```html
<!-- Highwire Press Tags -->
<meta name="citation_title" content="Paper Title">
<meta name="citation_author" content="Author Name">
<meta name="citation_publication_date" content="2026/02/04">
<meta name="citation_journal_title" content="Journal of ICTIRC - ISUFST Vol 1, Issue 2">
<meta name="citation_issn" content="2960-3773">
<meta name="citation_volume" content="1">
<meta name="citation_issue" content="2">
<meta name="citation_firstpage" content="1">
<meta name="citation_lastpage" content="10">
<meta name="citation_pdf_url" content="https://...pdf">
<meta name="citation_doi" content="10.xxxxx/xxxxx"> <!-- if available -->
<meta name="citation_conference_title" content="2nd ICTIRC"> <!-- if linked -->

<!-- JSON-LD Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  "headline": "Paper Title",
  "author": [
    {
      "@type": "Person",
      "name": "Author Name",
      "affiliation": {
        "@type": "Organization",
        "name": "ISUFST"
      }
    }
  ],
  "isPartOf": {
    "@type": "PublicationIssue",
    "issueNumber": "2",
    "isPartOf": {
      "@type": "PublicationVolume",
      "volumeNumber": "1",
      "isPartOf": {
        "@type": "Periodical",
        "name": "Journal of ICTIRC - ISUFST Vol 1, Issue 2",
        "issn": "2960-3773"
      }
    }
  }
}
</script>
```

---

## 🛠️ Setup & Verification Steps

### **1. Deploy Changes**
```bash
cd apps/web
pnpm build
# Deploy to production
```

### **2. Verify Sitemap**
Visit: `https://ictirc.isufst.edu.ph/sitemap.xml`

Should include:
- Volume pages: `/archive/volume/{volumeId}`
- Issue pages: `/archive/volume/{volumeId}/issue/{issueId}`
- Paper pages: `/archive/{paperId}`

### **3. Verify robots.txt**
Visit: `https://ictirc.isufst.edu.ph/robots.txt`

Should include:
```
User-agent: Googlebot-Scholar
Allow: /

Sitemap: https://ictirc.isufst.edu.ph/sitemap.xml
```

### **4. Test Paper Metadata**
1. Visit any paper page
2. View page source (Ctrl+U)
3. Search for `citation_` tags
4. Verify all fields are populated correctly

### **5. Submit to Google Search Console** (Recommended)
1. Go to https://search.google.com/search-console
2. Add property: `https://ictirc.isufst.edu.ph`
3. Verify ownership (DNS or HTML file method)
4. Submit sitemap: `/sitemap.xml`
5. Monitor indexing status

### **6. Test with Google Scholar Button** (Optional)
Install "Google Scholar Button" Chrome extension:
- Visit a paper page on your site
- Click the extension icon
- It should detect the citation metadata

---

## 📊 Expected Citation Format

Papers will appear in Google Scholar like this:

```
Paper Title Here
Author 1, Author 2, Author 3
Journal of ICTIRC - ISUFST Vol 1, Issue 2, 2026
ISUFST - College of Information and Computing Technology
```

With metadata showing:
- Volume, Issue, Pages
- Conference (if linked)
- ISSN
- DOI (if registered)
- Open Access PDF link

---

## 🔍 Monitoring & Maintenance

### **Regular Checks**
1. **Monthly**: Verify new papers appear in sitemap
2. **Quarterly**: Check Google Scholar for your papers
3. **Yearly**: Review and update metadata standards

### **Common Issues**
- **Papers not appearing**: Check if URL is in sitemap, verify metadata tags
- **Incorrect citation**: Review citation_* meta tags in page source
- **PDF not accessible**: Verify PDF URL is public and not behind login

### **Search for Your Papers**
```
site:ictirc.isufst.edu.ph "author name"
```
Or search directly in Google Scholar:
```
"Journal of ICTIRC - ISUFST"
```

---

## 🎯 Next Steps (Optional Enhancements)

### **1. ORCID Integration** (Recommended)
ORCID provides unique identifiers for researchers.

**Database Migration Needed:**
```sql
ALTER TABLE "ArchivedPaperAuthor" 
ADD COLUMN "orcid" VARCHAR(19);
```

**Form Updates:**
- Add ORCID field to upload forms
- Validate format: `0000-0001-2345-6789`

**Benefits:**
- Better author disambiguation
- Links to author's publication record
- Increased research visibility

### **2. Author Profile Pages** (Future Feature)
Create dedicated pages for each author:
- `/authors/[id]` - Author profile
- List all their publications
- Aggregate statistics
- Link to ORCID profile

**Implementation:**
1. Create `Author` aggregation (group ArchivedPaperAuthor by name/email)
2. Generate author pages
3. Add to sitemap
4. Link from paper pages

### **3. Apply for ISSN** (Highly Recommended)
Contact: **National Library of the Philippines**
- Website: https://web.nlp.gov.ph/
- Process: 2-4 weeks
- Cost: Usually free for academic institutions
- Required: Sample issues, editorial board info

**Why ISSN matters:**
- Recognized serial publication
- Required for some academic databases
- Enhances credibility
- Simplifies citation

---

## 📚 Additional Resources

- **Google Scholar Inclusion Guidelines**: https://scholar.google.com/intl/en/scholar/inclusion.html
- **Highwire Press Meta Tags**: https://scholar.google.com/intl/en/scholar/inclusion.html#indexing
- **Schema.org ScholarlyArticle**: https://schema.org/ScholarlyArticle
- **ORCID**: https://orcid.org/
- **DOI/Crossref**: https://www.crossref.org/

---

## ✉️ Support

For questions about:
- **Google Scholar indexing**: Contact Google Scholar support
- **ISSN application**: National Library of the Philippines
- **DOI registration**: ISUFST Library (check for institutional Crossref membership)
- **Technical issues**: Check this repository's issues or contact the dev team

---

**Last Updated**: February 4, 2026
**Status**: ✅ Ready for Google Scholar Indexing
