'use server';

import { prisma } from '@ictirc/database';
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
