// Helper to get text items with transform/style info
interface TextItem {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[];
  fontName: string;
  hasEOL: boolean;
}

export interface PaperMetadata {
    title?: string;
    authors: { name: string; affiliation?: string }[];
    abstract?: string;
    keywords?: string[];
    creationDate?: Date;
}
  
// Helper to group text items into visual lines based on Y position
interface VisualLine {
  y: number;
  height: number;
  text: string;
  items: TextItem[];
  isBold: boolean;
}

function groupTextItemsIntoLines(items: TextItem[]): VisualLine[] {
  // Sort by Y (descending) then X (ascending)
  const sorted = [...items].sort((a, b) => {
    const yDiff = b.transform[5] - a.transform[5];
    // Increase tolerance for superscripts/subscripts (often shifted by 3-5 units)
    if (Math.abs(yDiff) > 8) return yDiff; 
    return a.transform[4] - b.transform[4];
  });

  const lines: VisualLine[] = [];
  let currentLine: VisualLine | null = null;

  for (const item of sorted) {
    // Check if new line needed
    if (!currentLine || Math.abs(item.transform[5] - currentLine.y) > 8) {
      if (currentLine) lines.push(currentLine);
      currentLine = {
        y: item.transform[5],
        height: item.height,
        text: item.str,
        items: [item],
        isBold: item.fontName.toLowerCase().includes('bold'),
      };
    } else {
      // Add space if items are not adjacent (simple check)
      // rough heuristic: if x distance > 5, add space
      const lastItem = currentLine.items[currentLine.items.length - 1];
      const gap = item.transform[4] - (lastItem.transform[4] + lastItem.width);
      
      const separator = (gap > 2 || item.str.startsWith(" ")) ? "" : " "; 
      // Note: PDF text extraction is inconsistent with spaces. 
      // Safest is to add space if not already starting with one, unless very close.
      // For simplicity in this heuristic, we'll join clearly.
      
      currentLine.text += item.str; 
      currentLine.items.push(item);
    }
  }
  if (currentLine) lines.push(currentLine);
  
  // Post-process lines to clean up spacing
  return lines.map(l => ({
      ...l,
      text: l.items.map(i => i.str).join(" ").replace(/\s+/g, ' ').trim()
  }));
}

export async function extractPdfMetadata(file: File): Promise<PaperMetadata> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const doc = await loadingTask.promise;
    
    const page = await doc.getPage(1);
    const textContent = await page.getTextContent();
    const items = textContent.items as TextItem[];
    
    // Group into logical lines
    const lines = groupTextItemsIntoLines(items);
    
    const extracted: PaperMetadata = {
      authors: [],
      keywords: [],
    };

    // --- 1. Identify Title (Max Font Size in top region) ---
    let maxFontSize = 0;
    let titleLineIndex = -1;
    
    // Scan first 15 lines
    lines.slice(0, 15).forEach((line, idx) => {
        const fontSize = Math.sqrt(line.items[0].transform[0] ** 2 + line.items[0].transform[1] ** 2);
        // Bonus for Uppercase or Bold
        const isUpper = line.text === line.text.toUpperCase() && line.text.length > 5;
        const score = fontSize * (line.isBold ? 1.2 : 1.0) * (isUpper ? 1.1 : 1.0);
        
        if (score > maxFontSize && line.text.length > 5 && !line.text.includes('@')) {
            maxFontSize = score;
            titleLineIndex = idx;
        }
    });

    if (titleLineIndex !== -1) {
        // Capture title (and next line if similar size)
        extracted.title = lines[titleLineIndex].text;
        let nextIdx = titleLineIndex + 1;
        while (nextIdx < lines.length) {
            const nextLine = lines[nextIdx];
            const nextSize = Math.sqrt(nextLine.items[0].transform[0] ** 2 + nextLine.items[0].transform[1] ** 2);
            // If next line is close in size (> 80%)
            if (nextSize >= maxFontSize * 0.7) { 
                 extracted.title += " " + nextLine.text;
                 nextIdx++;
            } else {
                break;
            }
        }
        
        // --- 2. Locate Abstract & Keywords ---
        // Regex to find "Abstract" followed by dash, colon, or dot
        // Handling: "Abstract—", "Abstract-", "Abstract:", "Abstract."
        const abstractRegex = /^(?:abstract|summary)\s*[-—–:.]\s*(.*)/i;
        const keywordsRegex = /^(?:keywords|index terms)\s*[-—–:.]\s*(.*)/i;
        
        const abstractLineIndex = lines.findIndex(l => l.text.match(abstractRegex));
        let keywordsLineIndex = lines.findIndex(l => l.text.match(keywordsRegex));
        
        // --- 3. Extract Abstract Content ---
        if (abstractLineIndex !== -1) {
             const match = lines[abstractLineIndex].text.match(abstractRegex);
             let abstractText = match ? match[1] : "";
             
             // Append subsequent lines until we hit Keywords or Introduction or a Header
             // Stop if we hit keywords (if found)
             const stopIndex = keywordsLineIndex !== -1 ? keywordsLineIndex : lines.length;
             
             for (let i = abstractLineIndex + 1; i < stopIndex; i++) {
                 const lineText = lines[i].text;
                 // Heuristic stop: Section header (I. Introduction)
                 if (/^(?:I\.|1\.|Introduction|Reference)/i.test(lineText)) break;
                 
                 abstractText += " " + lineText;
             }
             extracted.abstract = abstractText.trim();
        }

        // --- 4. Extract Keywords Content ---
        if (keywordsLineIndex !== -1) {
            const match = lines[keywordsLineIndex].text.match(keywordsRegex);
            let kwText = match ? match[1] : "";
            
            // Check next line for continuation (often keywords wrap)
            // Stop if Section Header
            if (lines[keywordsLineIndex + 1]) {
                const nextLine = lines[keywordsLineIndex + 1].text;
                if (!/^(?:I\.|1\.|Introduction)/i.test(nextLine)) {
                     kwText += " " + nextLine;
                }
            }
            
            // Split by semicolon OR comma
            extracted.keywords = kwText.split(/[;,]/)
                .map(k => k.trim())
                .filter(k => k.length > 2);
        }
        
        // --- 5. Parse Header Block (Title -> ... -> Abstract) ---
        // The block is lines between TitleEnd and AbstractStart
        const headerEndIndex = abstractLineIndex !== -1 ? abstractLineIndex : 15;
        const metadataLines = lines.slice(nextIdx, headerEndIndex);
        
        // Locate Email Line(s) - usually at the bottom of this block
        const emailLineIndices: number[] = [];
        metadataLines.forEach((l, i) => {
            if (l.text.includes('@')) emailLineIndices.push(i);
        });

        if (emailLineIndices.length > 0) {
            // Strict user layout: 
            // [Authors]
            // [Affiliation] 
            // [Emails]
            
            // Assume the first email line starts the "Email Section"
            const firstEmailRelIdx = emailLineIndices[0];
            
            // Extract Emails
            const foundEmails: string[] = [];
            // Parse all email lines
            emailLineIndices.forEach(idx => {
                const text = metadataLines[idx].text;
                // Simple regex for email extraction
                const matches = text.match(/[\w.-]+@[\w.-]+\.\w+/g);
                if (matches) foundEmails.push(...matches);
            });
            
            // Affiliation is the line(s) IMMEDIATELY BEFORE the first email line
            // We'll take 1 line up.
            let affiliation = "";
            let affiliationRelIdx = firstEmailRelIdx - 1;
            
            if (affiliationRelIdx >= 0) {
                 const affLine = metadataLines[affiliationRelIdx];
                 // Clean up leading numbers if they used superscript logic inline
                 // e.g. "1,2,3 University Name"
                 affiliation = affLine.text.replace(/^[\d,]+\s*/, '');
            }
            
            // Authors are all lines BEFORE Affiliation
            // and AFTER Title
            // We join them and split by comma or "and"
            const authorTextLines = metadataLines.slice(0, Math.max(0, affiliationRelIdx));
            const fullAuthorString = authorTextLines.map(l => l.text).join(" ");
            
            // Split and Clean
            // Remove superscripts (numbers attached to end of words)
            // Regex: Replace digit at end of word or standalone
            const cleanAuthorString = fullAuthorString.replace(/(\d+)/g, ''); 
            
            const rawAuthors = cleanAuthorString.split(/,| and /).map(a => a.trim()).filter(a => a.length > 2);
            
            // Map 1-to-1 with emails if possible
            extracted.authors = rawAuthors.map((name, i) => ({
                name: name,
                affiliation: affiliation,
                email: foundEmails[i] || undefined // 1st author gets 1st email
            }));
            
        } else {
            // Fallback: If no emails found (unlikely for this specific paper but possible)
            // Just assume all lines between Title and Abstract are Authors/Affiliations mixed
            // This is harder. For now, let's trust the email finder.
            
            // Try to just take the first line as authors
            if (metadataLines.length > 0) {
                 const authorParts = metadataLines[0].text.split(/,| and /);
                 extracted.authors = authorParts.map(name => ({
                     name: name.replace(/\d+/g, '').trim(),
                     affiliation: metadataLines[1]?.text || ""
                 }));
            }
        }
    }

    return extracted;

  } catch (error) {
    console.error("Error parsing PDF:", error);
    // Return empty to avoid crash
    return { authors: [] };
  }
}

