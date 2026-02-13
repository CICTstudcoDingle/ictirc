import { NextResponse } from "next/server";
import { prisma } from "@ictirc/database";
import { getVideoStreamUrl } from "@ictirc/storage/r2";

export const dynamic = "force-dynamic";

/**
 * GET /api/videos - Fetch published promotional videos for public display
 */
export async function GET() {
  try {
    const videos = await prisma.promotionalVideo.findMany({
      where: { isPublished: true },
      orderBy: { uploadDate: "desc" },
    });

    // Generate stream URLs for each video (24h expiry for public viewing)
    const videosWithUrls = await Promise.all(
      videos.map(async (video) => {
        const streamResult = await getVideoStreamUrl(video.r2Key, 86400);
        return {
          id: video.id,
          title: video.title,
          description: video.description,
          type: video.type,
          streamUrl: streamResult.success ? streamResult.url : null,
          editorName: video.editorName,
          uploadDate: video.uploadDate.toISOString(),
        };
      })
    );

    return NextResponse.json({ videos: videosWithUrls });
  } catch (error) {
    console.error("[Public Videos API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
