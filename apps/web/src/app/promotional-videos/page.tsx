import { Metadata } from "next";
import { prisma } from "@ictirc/database";
import { getVideoStreamUrl } from "@ictirc/storage/r2";
import { VideoPlayer } from "@/components/videos/video-player";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { CircuitBackground } from "@ictirc/ui";
import { Film, Video } from "lucide-react";

export const metadata: Metadata = {
  title: "Promotional Videos | IRJICT",
  description:
    "Watch promotional videos from the College of Information and Computing Technology (CICT) and IT Week event teasers.",
};

export const dynamic = "force-dynamic";

export default async function PromotionalVideosPage() {
  // Fetch published videos server-side
  const videos = await prisma.promotionalVideo.findMany({
    where: { isPublished: true },
    orderBy: { uploadDate: "desc" },
  });

  type VideoWithUrl = {
    id: string;
    title: string;
    description: string | null;
    type: "PROMOTIONAL" | "TEASER";
    streamUrl: string | null;
    editorName: string;
    uploadDate: string;
  };

  // Generate stream URLs server-side
  const videosWithUrls: VideoWithUrl[] = await Promise.all(
    videos.map(async (video: typeof videos[number]) => {
      const streamResult = await getVideoStreamUrl(video.r2Key, 86400);
      return {
        id: video.id,
        title: video.title,
        description: video.description,
        type: video.type as "PROMOTIONAL" | "TEASER",
        streamUrl: streamResult.success ? (streamResult.url ?? null) : null,
        editorName: video.editorName,
        uploadDate: video.uploadDate.toISOString(),
      };
    })
  );

  const promoVideos = videosWithUrls.filter((v: VideoWithUrl) => v.type === "PROMOTIONAL");
  const teaserVideos = videosWithUrls.filter((v: VideoWithUrl) => v.type === "TEASER");

  return (
    <div className="pt-14 md:pt-16">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 py-16 md:py-24 overflow-hidden">
        <CircuitBackground variant="subtle" animated />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up" delay={0.2}>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Promotional <span className="text-gold">Videos</span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-2xl">
              Watch the latest promotional materials from the College of
              Information and Computing Technology and event teasers for IT Week.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* CICT Promotional Videos Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-maroon/10 rounded-full flex items-center justify-center">
                <Film className="w-5 h-5 text-maroon" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  CICT Department
                </h2>
                <p className="text-sm text-gray-500">
                  College of Information and Computing Technology
                </p>
              </div>
            </div>
          </ScrollAnimation>

          {promoVideos.length === 0 ? (
            <ScrollAnimation direction="up" delay={0.2}>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
                <Film className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  No promotional videos available yet.
                </p>
              </div>
            </ScrollAnimation>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {promoVideos.map((video, index) => (
                <ScrollAnimation
                  key={video.id}
                  direction="up"
                  staggerIndex={index}
                >
                  <VideoPlayer video={video} />
                </ScrollAnimation>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* IT Week Teaser Videos Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Video className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  IT Week Event Teasers
                </h2>
                <p className="text-sm text-gray-500">
                  Previews for the annual IT Week celebration
                </p>
              </div>
            </div>
          </ScrollAnimation>

          {teaserVideos.length === 0 ? (
            <ScrollAnimation direction="up" delay={0.2}>
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  No event teasers available yet.
                </p>
              </div>
            </ScrollAnimation>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {teaserVideos.map((video, index) => (
                <ScrollAnimation
                  key={video.id}
                  direction="up"
                  staggerIndex={index}
                >
                  <VideoPlayer video={video} />
                </ScrollAnimation>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
