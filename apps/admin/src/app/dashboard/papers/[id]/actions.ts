'use server';

import { prisma, PlagiarismStatus } from '@ictirc/database';
import { revalidatePath } from 'next/cache';
import { convertDocxToPdf } from '@/lib/cloudconvert';
import { generateDoi } from '@/lib/doi';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PublishResult {
  success: boolean;
  error?: string;
  doi?: string;
  pdfUrl?: string;
}

export async function publishPaper(paperId: string): Promise<PublishResult> {
  try {
    // Get paper details
    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
      include: {
        authors: {
          include: { author: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!paper) {
      return { success: false, error: 'Paper not found' };
    }

    if (paper.status === 'PUBLISHED') {
      return { success: false, error: 'Paper is already published' };
    }

    if (!paper.rawFileUrl) {
      return { success: false, error: 'No file uploaded' };
    }

    let pdfUrl = paper.rawFileUrl;
    const isDocx = paper.rawFileUrl.toLowerCase().match(/\.docx?$/);

    // Convert DOCX to PDF if needed
    if (isDocx) {
      try {
        // Convert using CloudConvert
        const conversionResult = await convertDocxToPdf(
          paper.rawFileUrl,
          `${paper.title}.docx`
        );

        // Download the converted PDF
        const pdfResponse = await fetch(conversionResult.url);
        if (!pdfResponse.ok) {
          throw new Error('Failed to download converted PDF');
        }

        const pdfBlob = await pdfResponse.blob();
        const pdfFile = new File([pdfBlob], `${paper.id}.pdf`, { type: 'application/pdf' });

        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_HOT!)
          .upload(`papers/${paper.id}.pdf`, pdfFile, {
            contentType: 'application/pdf',
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`Failed to upload PDF: ${uploadError.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_HOT!)
          .getPublicUrl(uploadData.path);

        pdfUrl = urlData.publicUrl;
      } catch (conversionError) {
        console.error('Conversion error:', conversionError);
        return {
          success: false,
          error: `Conversion failed: ${conversionError instanceof Error ? conversionError.message : 'Unknown error'}`,
        };
      }
    }

    // Generate DOI
    const doi = await generateDoi();

    // Update paper
    const updatedPaper = await prisma.paper.update({
      where: { id: paperId },
      data: {
        status: 'PUBLISHED',
        pdfUrl,
        doi,
        publishedAt: new Date(),
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        actorId: 'admin-system',
        actorEmail: 'admin@ictirc.com',
        action: 'PUBLISH_PAPER',
        targetId: paperId,
        targetType: 'Paper',
        metadata: {
          doi,
          pdfUrl,
          convertedFromDocx: isDocx ? true : false,
        },
      },
    });

    revalidatePath(`/dashboard/papers/${paperId}`);
    revalidatePath('/dashboard/papers');
    revalidatePath('/archive');

    return {
      success: true,
      doi: updatedPaper.doi || undefined,
      pdfUrl: updatedPaper.pdfUrl || undefined,
    };
  } catch (error) {
    console.error('Publish error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to publish paper',
    };
  }
}

export async function updatePublicationStep(paperId: string, step: number, note?: string) {
  try {
    const updatedPaper = await prisma.paper.update({
      where: { id: paperId },
      data: {
        publicationStep: step,
        publicationNote: note,
      },
    });

    // Create log
    await prisma.auditLog.create({
      data: {
        actorId: 'admin-system', // Should be current user, but context limitations. Acceptable for now.
        action: 'UPDATE_PUBLICATION_STEP',
        targetId: paperId,
        targetType: 'Paper',
        metadata: {
          step,
          note,
        },
      },
    });

    revalidatePath(`/dashboard/papers/${paperId}`);
    revalidatePath(`/track/${paperId}`); // Revalidate public tracking page
    return { success: true, paper: updatedPaper };
  } catch (error) {
    console.error('Error updating step:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update publication step',
    };
  }
}

// ============================================
// PLAGIARISM CHECK ACTIONS
// ============================================

/**
 * Thresholds for automatic plagiarism status determination
 * - Under 15%: Auto-PASS
 * - 15-25%: FLAGGED for editor review
 * - Over 25%: Auto-REJECTED (Dean can override)
 */
function determinePlagiarismStatus(score: number): PlagiarismStatus {
  if (score < 15) return 'PASS';
  if (score <= 25) return 'FLAGGED';
  return 'REJECTED';
}

interface RecordPlagiarismInput {
  paperId: string;
  score: number;        // 0-100
  notes?: string;       // e.g., "Checked via Turnitin on 2026-03-01"
  checkedByUserId: string;
}

/**
 * Record a plagiarism check result for a paper.
 * Editors and Dean can record. Status is auto-determined by thresholds.
 */
export async function recordPlagiarismCheck(input: RecordPlagiarismInput) {
  try {
    const { paperId, score, notes, checkedByUserId } = input;

    // Validate score range
    if (score < 0 || score > 100) {
      return { success: false, error: 'Score must be between 0 and 100' };
    }

    // Verify the paper exists
    const paper = await prisma.paper.findUnique({ where: { id: paperId } });
    if (!paper) {
      return { success: false, error: 'Paper not found' };
    }

    // Determine status based on thresholds
    const status = determinePlagiarismStatus(score);

    // Update paper with plagiarism data
    const updatedPaper = await prisma.paper.update({
      where: { id: paperId },
      data: {
        plagiarismScore: score,
        plagiarismStatus: status,
        plagiarismCheckedAt: new Date(),
        plagiarismCheckedBy: checkedByUserId,
        plagiarismNotes: notes || null,
        // Clear any previous override if re-checking
        plagiarismOverriddenBy: null,
        plagiarismOverrideNote: null,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: checkedByUserId,
        action: 'RECORD_PLAGIARISM_CHECK',
        targetId: paperId,
        targetType: 'Paper',
        metadata: {
          score,
          status,
          notes: notes || null,
        },
      },
    });

    revalidatePath(`/dashboard/papers/${paperId}`);
    revalidatePath('/dashboard/papers');

    return {
      success: true,
      paper: updatedPaper,
      status,
      message: status === 'PASS'
        ? `Score ${score}% — Auto-passed (under 15%)`
        : status === 'FLAGGED'
        ? `Score ${score}% — Flagged for editor review (15-25%)`
        : `Score ${score}% — Auto-rejected (over 25%). Dean can override.`,
    };
  } catch (error) {
    console.error('[recordPlagiarismCheck] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to record plagiarism check',
    };
  }
}

interface OverridePlagiarismInput {
  paperId: string;
  overriddenByUserId: string;
  overrideNote: string;     // Required: Dean must provide a reason
}

/**
 * Dean-only: Override a plagiarism rejection.
 * Changes status from REJECTED → OVERRIDDEN.
 */
export async function overridePlagiarismRejection(input: OverridePlagiarismInput) {
  try {
    const { paperId, overriddenByUserId, overrideNote } = input;

    if (!overrideNote.trim()) {
      return { success: false, error: 'Override reason is required' };
    }

    // Verify the user is a Dean
    const user = await prisma.user.findUnique({ where: { id: overriddenByUserId } });
    if (!user || user.role !== 'DEAN') {
      return { success: false, error: 'Only the Dean can override plagiarism rejections' };
    }

    // Get current paper
    const paper = await prisma.paper.findUnique({ where: { id: paperId } });
    if (!paper) {
      return { success: false, error: 'Paper not found' };
    }

    if (paper.plagiarismStatus !== 'REJECTED') {
      return {
        success: false,
        error: `Cannot override: current plagiarism status is ${paper.plagiarismStatus}, not REJECTED`,
      };
    }

    // Apply override
    const updatedPaper = await prisma.paper.update({
      where: { id: paperId },
      data: {
        plagiarismStatus: 'OVERRIDDEN',
        plagiarismOverriddenBy: overriddenByUserId,
        plagiarismOverrideNote: overrideNote,
      },
    });

    // Audit log (critical action)
    await prisma.auditLog.create({
      data: {
        actorId: overriddenByUserId,
        actorEmail: user.email,
        action: 'OVERRIDE_PLAGIARISM_REJECTION',
        targetId: paperId,
        targetType: 'Paper',
        metadata: {
          previousScore: paper.plagiarismScore,
          overrideNote,
        },
      },
    });

    revalidatePath(`/dashboard/papers/${paperId}`);
    revalidatePath('/dashboard/papers');

    return {
      success: true,
      paper: updatedPaper,
      message: `Plagiarism rejection overridden by Dean. Reason: ${overrideNote}`,
    };
  } catch (error) {
    console.error('[overridePlagiarismRejection] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to override plagiarism rejection',
    };
  }
}
