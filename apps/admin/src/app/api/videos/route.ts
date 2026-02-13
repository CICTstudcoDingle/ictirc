import { NextResponse } from "next/server";
import { prisma } from "@ictirc/database/client";
import { getVideoStreamUrl, deleteFromR2 } from "@ictirc/storage/r2";

export const dynamic = "force-dynamic";

/**
 * GET /api/videos - List all promotional videos
 */
export async function GET() {
  try {
    const videos = await prisma.promotionalVideo.findMany({
      orderBy: { uploadDate: "desc" },
    });

    // Generate stream URLs for each video
    const videosWithUrls = await Promise.all(
      videos.map(async (video: typeof videos[number]) => {
        const streamResult = await getVideoStreamUrl(video.r2Key, 86400);
        return {
          ...video,
          streamUrl: streamResult.success ? streamResult.url : null,
        };
      })
    );

    return NextResponse.json({ videos: videosWithUrls });
  } catch (error) {
    console.error("[Videos API] Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/videos - Create a new promotional video record
 * (Called after the video is uploaded to R2 via presigned URL)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, type, r2Key, thumbnailUrl, editorName } = body;

    if (!title || !type || !r2Key || !editorName) {
      return NextResponse.json(
        { error: "Title, type, r2Key, and editorName are required" },
        { status: 400 }
      );
    }

    if (!["PROMOTIONAL", "TEASER"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be PROMOTIONAL or TEASER" },
        { status: 400 }
      );
    }

    const video = await prisma.promotionalVideo.create({
      data: {
        title,
        description: description || null,
        type,
        r2Key,
        thumbnailUrl: thumbnailUrl || null,
        editorName,
        isPublished: true,
      },
    });

    return NextResponse.json({ video });
  } catch (error) {
    console.error("[Videos API] Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/videos - Update a promotional video
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, description, isPublished } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    const video = await prisma.promotionalVideo.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(isPublished !== undefined && { isPublished }),
      },
    });

    return NextResponse.json({ video });
  } catch (error) {
    console.error("[Videos API] Error updating video:", error);
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/videos - Delete a promotional video
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    // Get the video first to delete from R2
    const video = await prisma.promotionalVideo.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    // Delete from R2
    await deleteFromR2(video.r2Key);

    // Delete from database
    await prisma.promotionalVideo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Videos API] Error deleting video:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
