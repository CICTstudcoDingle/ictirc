"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Calendar,
  User,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

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

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Auto-hide controls after 3 seconds of inactivity
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    if (isPlaying) {
      hideControlsTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    } else {
      resetHideTimer();
    }
  }, [isPlaying, resetHideTimer]);

  // Time update listener
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const onTimeUpdate = () => {
      if (!isDragging) setCurrentTime(vid.currentTime);
    };
    const onLoadedMetadata = () => setDuration(vid.duration);
    const onDurationChange = () => setDuration(vid.duration);

    vid.addEventListener("timeupdate", onTimeUpdate);
    vid.addEventListener("loadedmetadata", onLoadedMetadata);
    vid.addEventListener("durationchange", onDurationChange);

    return () => {
      vid.removeEventListener("timeupdate", onTimeUpdate);
      vid.removeEventListener("loadedmetadata", onLoadedMetadata);
      vid.removeEventListener("durationchange", onDurationChange);
    };
  }, [isDragging]);

  // Fullscreen change listener
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

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

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(
      0,
      Math.min(videoRef.current.duration, videoRef.current.currentTime + seconds)
    );
    resetHideTimer();
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen not supported
    }
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    seekTo(e);

    const onMouseMove = (ev: MouseEvent) => {
      if (!videoRef.current || !progressRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
      videoRef.current.currentTime = ratio * duration;
      setCurrentTime(ratio * duration);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
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
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-maroon/30 transition-all">
      {/* Video Container */}
      <div
        ref={containerRef}
        className={`relative bg-gray-900 ${isFullscreen ? "flex items-center justify-center" : "aspect-video"}`}
        onMouseMove={resetHideTimer}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={video.streamUrl}
          className={`w-full ${isFullscreen ? "max-h-screen object-contain" : "h-full object-cover"}`}
          autoPlay
          muted
          loop
          playsInline
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Controls Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Center Play/Pause indicator (tap area) */}
          <button
            onClick={togglePlay}
            className="absolute inset-0 w-full h-full cursor-pointer"
            aria-label={isPlaying ? "Pause" : "Play"}
          />

          {/* Bottom Controls Bar */}
          <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-8">
            {/* Progress Bar */}
            <div
              ref={progressRef}
              className="group/progress w-full h-1.5 bg-white/20 rounded-full mb-3 cursor-pointer hover:h-2.5 transition-all relative"
              onMouseDown={handleProgressMouseDown}
            >
              {/* Buffered / played */}
              <div
                className="absolute inset-y-0 left-0 bg-gold rounded-full transition-[width] duration-100"
                style={{ width: `${progress}%` }}
              />
              {/* Scrubber handle */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-gold rounded-full shadow-md opacity-0 group-hover/progress:opacity-100 transition-opacity"
                style={{ left: `calc(${progress}% - 7px)` }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>

                {/* Skip Back 10s */}
                <button
                  onClick={() => skip(-10)}
                  className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                  aria-label="Rewind 10 seconds"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                {/* Skip Forward 10s */}
                <button
                  onClick={() => skip(10)}
                  className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                  aria-label="Forward 10 seconds"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                {/* Time Display */}
                <span className="text-white/80 text-xs font-mono ml-1.5 hidden sm:inline">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Mute/Unmute */}
                <button
                  onClick={toggleMute}
                  className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize className="w-4 h-4" />
                  ) : (
                    <Maximize className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Type Badge */}
        <div
          className={`absolute top-3 left-3 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
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
          <div className="mb-3">
            <p
              className={`text-sm text-gray-600 ${
                !isDescExpanded ? "line-clamp-2" : ""
              }`}
            >
              {video.description}
            </p>
            {video.description.length > 120 && (
              <button
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="inline-flex items-center gap-0.5 text-xs text-maroon font-medium mt-1 hover:underline"
              >
                {isDescExpanded ? (
                  <>
                    Show less <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    Show more <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            )}
          </div>
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
