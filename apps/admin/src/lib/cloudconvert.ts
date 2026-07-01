import CloudConvert from "cloudconvert";

export interface ConversionResult {
  url: string;
  filename: string;
  size: number;
}

function getCloudConvertClient(): CloudConvert {
  const apiKey = process.env.CLOUDCONVERT_API_KEY;
  if (!apiKey) {
    throw new Error("CLOUDCONVERT_API_KEY is not set in environment variables");
  }
  return new CloudConvert(apiKey);
}

export function isCloudConvertConfigured(): boolean {
  return !!process.env.CLOUDCONVERT_API_KEY;
}

/**
 * Convert a DOCX file to PDF using CloudConvert API
 * @param fileUrl - URL of the DOCX file to convert
 * @param filename - Original filename
 * @returns URL of the converted PDF file
 */
export async function convertDocxToPdf(
  fileUrl: string,
  filename: string,
): Promise<ConversionResult> {
  try {
    const cloudconvert = getCloudConvertClient();

    // Create a job to convert DOCX to PDF
    let job = await cloudconvert.jobs.create({
      tasks: {
        "import-file": {
          operation: "import/url",
          url: fileUrl,
          filename: filename,
        },
        "convert-to-pdf": {
          operation: "convert",
          input: "import-file",
          output_format: "pdf",
          engine: "office",
        },
        "export-pdf": {
          operation: "export/url",
          input: "convert-to-pdf",
        },
      },
    });

    // Wait for the job to complete
    job = await cloudconvert.jobs.wait(job.id);

    // Get the export task
    const exportTask = job.tasks?.filter(
      (task) => task.operation === "export/url" && task.status === "finished",
    )[0];

    if (!exportTask?.result?.files?.[0]) {
      throw new Error("Conversion failed: No output file");
    }

    const file = exportTask.result.files[0];

    if (!file.url) {
      throw new Error("Conversion failed: No URL in result");
    }

    return {
      url: file.url,
      filename: file.filename || "converted.pdf",
      size: file.size || 0,
    };
  } catch (error) {
    console.error("CloudConvert error:", error);
    throw new Error(
      `Failed to convert DOCX to PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
