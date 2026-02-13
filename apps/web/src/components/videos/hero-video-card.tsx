import { prisma } from "@ictirc/database";
import { getVideoStreamUrl } from "@ictirc/storage/r2";
import { HeroVideoCardClient } from "./hero-video-card-client";

/**
 * Server component that fetches video data and renders the hero video card.
 * Shows a small card below the events card that rotates between promo and teaser videos.
 */
export async function HeroVideoCard() {
  // Fetch published videos (latest of each type)
  const videos = await prisma.promotionalVideo.findMany({
    where: { isPublished: true },
    orderBy: { uploadDate: "desc" },
    take: 2, // Get the most recent of each type
  });

  if (videos.length === 0) return null;

  // Generate stream URLs server-side
  const videosWithUrls = await Promise.all(
    videos.map(async (video) => {
      const streamResult = await getVideoStreamUrl(video.r2Key, 86400);
      return {
        id: video.id,
        title: video.title,
        type: video.type as "PROMOTIONAL" | "TEASER",
        streamUrl: streamResult.success ? streamResult.url : null,
        editorName: video.editorName,
        uploadDate: video.uploadDate.toISOString(),
      };
    })
  );

  // Filter out videos without stream URLs
  const validVideos = videosWithUrls.filter((v) => v.streamUrl);
  if (validVideos.length === 0) return null;

  return <HeroVideoCardClient videos={validVideos} />;
}
