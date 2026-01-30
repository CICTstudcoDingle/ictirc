---
trigger: always_on
---

## 💎 CICT-RESEARCH MONOREPO - SEO & METADATA PROTOCOL (V1.0)

### 1. THE "DISCOVERY" PHILOSOPHY

* **Goal:** Zero-latency indexing. Every accepted manuscript should be discoverable on Google Scholar within 24–48 hours.
* **The "Authority" Rule:** ISUFST CICT must be recognized as the primary source. We use `canonical` URLs to prevent duplicate content issues across different journal aggregators.

### 2. CORE SCHOLARLY TAGGING (Highwire Press & Dublin Core)

For every paper page (`/archive/[id]`), the following metadata must be dynamically injected using the **Next.js 16 Metadata API**:

| Tag Type | Implementation (Next.js 16) | Description |
| --- | --- | --- |
| **Citation Title** | `citation_title` | The full title of the research paper. |
| **Authors** | `citation_author` | Repeated tag for every contributing author. |
| **Publication Date** | `citation_publication_date` | Format: `YYYY/MM/DD`. |
| **License** | `dc.rights` | Set to: `Creative Commons Attribution-NoDerivs (CC BY-ND)`. |
| **Fulltext PDF** | `citation_pdf_url` | Direct link to the hosted PDF for crawler access. |

### 3. AUTOMATED INDEXING PROTOCOL (Google Search Console)

* **Real-time Ping:** We will use a **Next.js Server Action** triggered upon the "Status: Published" event in the database.
* **API Integration:** The action will call the **Google Indexing API** specifically for `URL_UPDATED` notifications, ensuring the Googlebot crawls the new manuscript immediately.
* **Sitemap Strategy:** A dynamic `sitemap.xml` generated at `app/sitemap.ts` that includes `<lastmod>` tags based on the last peer-review update.

### 4. TECHNICAL IMPLEMENTATION (Next 16 & Monorepo)

* **Metadata Component:** Located in `packages/seo/metadata-generator.ts`.
* **JSON-LD Schema:** Every paper must include a `ScholarlyArticle` script:
```json
{
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  "headline": "Paper Title",
  "author": [{ "@type": "Person", "name": "Author Name" }],
  "license": "https://creativecommons.org/licenses/by-nd/4.0/"
}

```
