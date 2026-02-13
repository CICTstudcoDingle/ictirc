"use client";

import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Calendar, User } from "lucide-react";

interface VideoData {
  id: string;
  title: string;
  description: string | null;
  type: "PROMOTIONAL" | "TEASER";
  streamUrl: string | null;
  editorName: string;
  uploadDate: string;
}

interface VideoPlayerProps {
  video: VideoData;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (!video.streamUrl) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="aspect-video bg-gray-900 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Video unavailable</p>
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-gray-900">{video.title}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-maroon/30 transition-all group">
      {/* Video Container */}
      <div className="relative aspect-video bg-gray-900">
        <video
          ref={videoRef}
          src={video.streamUrl}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Video Controls Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>
            <button
              onClick={toggleMute}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
              video.type === "PROMOTIONAL"
                ? "bg-maroon/80 text-white"
                : "bg-amber-500/80 text-white"
            }`}
          >
            {video.type === "PROMOTIONAL" ? "CICT Promo" : "IT Week Teaser"}
          </span>
        </div>
      </div>

      {/* Card Info - Left bordered "Manuscript" style */}
      <div className="border-l-4 border-maroon p-5">
        <h3 className="font-semibold text-gray-900 text-lg mb-1">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {video.description}
          </p>
        )}
        <div className="flex items-center gap-4 text-xs text-gray-400 font-mono">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {video.editorName}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(video.uploadDate)}
          </span>
        </div>
      </div>
    </div>
  );
}
