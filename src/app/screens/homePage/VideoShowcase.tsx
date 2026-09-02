import { useCallback, useEffect, useRef } from "react";

export default function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const resumeVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.defaultMuted = true;
    video.muted = true;
    video.playbackRate = 1;
    if (video.ended) video.currentTime = 0;
    void video.play().catch(() => undefined);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let isInView = false;

    const resumeWhenVisible = () => {
      if (document.visibilityState === "visible" && isInView) resumeVideo();
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      isInView = entry.isIntersecting;
      resumeWhenVisible();
    }, { rootMargin: "120px 0px", threshold: 0.05 });
    observer.observe(video);
    document.addEventListener("visibilitychange", resumeWhenVisible);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", resumeWhenVisible);
    };
  }, [resumeVideo]);

  return (
    <section className="tech-video" aria-label="Techanor video showcase">
      <div className="tech-video__player">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          aria-label="Techanor technology showcase"
          tabIndex={-1}
        >
          <source src="/video/Odyssey G7 37   Official Introduction   Samsung_(0).mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
