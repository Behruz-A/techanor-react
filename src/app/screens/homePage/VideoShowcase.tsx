import { useCallback, useEffect, useRef } from "react";

export default function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const resumeVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.ended) video.currentTime = 0;
    void video.play().catch(() => undefined);
  }, []);

  const keepVideoLooping = useCallback(() => {
    const video = videoRef.current;
    if (!video || document.visibilityState !== "visible") return;

    const isNearEnd = Number.isFinite(video.duration) && video.duration > 0 && video.duration - video.currentTime <= 0.4;
    if (video.ended || isNearEnd) video.currentTime = 0;
    if (video.paused || video.ended || isNearEnd) void video.play().catch(() => undefined);
  }, []);

  useEffect(() => {
    const resumeWhenVisible = () => {
      if (document.visibilityState === "visible") resumeVideo();
    };

    const playbackWatchdog = window.setInterval(keepVideoLooping, 250);
    document.addEventListener("visibilitychange", resumeWhenVisible);
    resumeVideo();
    return () => {
      window.clearInterval(playbackWatchdog);
      document.removeEventListener("visibilitychange", resumeWhenVisible);
    };
  }, [keepVideoLooping, resumeVideo]);

  return (
    <section className="tech-video" aria-label="Techanor video showcase">
      <div className="tech-video__player">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Techanor technology showcase"
          tabIndex={-1}
          onCanPlay={resumeVideo}
          onEnded={resumeVideo}
          onPause={() => {
            if (document.visibilityState === "visible") resumeVideo();
          }}
        >
          <source src="/video/Odyssey G7 37   Official Introduction   Samsung_(0).mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
