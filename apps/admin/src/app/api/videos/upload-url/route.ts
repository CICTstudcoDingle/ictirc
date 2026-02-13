import { NextResponse } from "next/server";
import {
  getVideoUploadPresignedUrl,
  generateVideoR2Key,
  ALLOWED_VIDEO_TYPES,
  MAX_VIDEO_SIZE,
} from "@ictirc/storage/r2";

/**
 * POST /api/videos/upload-url - Generate a presigned URL for direct R2 upload
 * This allows the browser to upload large video files directly to R2
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileName, contentType, fileSize, type } = body;

    // Validate inputs
    if (!fileName || !contentType || !fileSize || !type) {
      return NextResponse.json(
        { error: "fileName, contentType, fileSize, and type are required" },
        { status: 400 }
      );
    }

    // Validate video type
    if (!["promotional", "teaser"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be 'promotional' or 'teaser'" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_VIDEO_TYPES.includes(contentType as any)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed types: ${ALLOWED_VIDEO_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate file size (max 1GB)
    if (fileSize > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the maximum limit of 1GB" },
        { status: 400 }
      );
    }

    // Generate R2 key and presigned URL
    const r2Key = generateVideoR2Key(type, fileName);
    const result = await getVideoUploadPresignedUrl(r2Key, contentType);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to generate upload URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      uploadUrl: result.url,
      r2Key: result.r2Key,
    });
  } catch (error) {
    console.error("[Videos Upload URL API] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
