import { useCallback, useEffect, useRef } from "react";

const RESTART_BEFORE_END_SECONDS = 2.5;

export default function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastPlaybackTimeRef = useRef(0);
  const stalledChecksRef = useRef(0);
  const recoveryTimerRef = useRef<number | null>(null);

  const resumeVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.defaultMuted = true;
    video.muted = true;
    video.playbackRate = 1;
    if (video.ended) video.currentTime = 0;
    void video.play().catch(() => undefined);
  }, []);

  const restartVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    lastPlaybackTimeRef.current = 0;
    stalledChecksRef.current = 0;
    void video.play().catch(() => undefined);
  }, []);

  const recoverVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    video.load();
    lastPlaybackTimeRef.current = 0;
    stalledChecksRef.current = 0;
    void video.play().catch(() => undefined);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const resumeWhenVisible = () => {
      if (document.visibilityState === "visible") resumeVideo();
    };

    window.addEventListener("pageshow", resumeVideo);
    document.addEventListener("visibilitychange", resumeWhenVisible);
    resumeVideo();

    const playbackWatchdog = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;

      const duration = video.duration;
      const currentTime = video.currentTime;
      const isNearEnd =
        Number.isFinite(duration) &&
        duration > RESTART_BEFORE_END_SECONDS &&
        currentTime >= duration - RESTART_BEFORE_END_SECONDS;

      if (video.ended || isNearEnd) {
        restartVideo();
        return;
      }

      if (video.paused) resumeVideo();

      if (currentTime > 0 && Math.abs(currentTime - lastPlaybackTimeRef.current) < 0.05) {
        stalledChecksRef.current += 1;
      } else {
        stalledChecksRef.current = 0;
      }

      if (stalledChecksRef.current >= 3) {
        recoverVideo();
        return;
      }

      lastPlaybackTimeRef.current = video.currentTime;
    }, 250);

    return () => {
      window.clearInterval(playbackWatchdog);
      if (recoveryTimerRef.current !== null) window.clearTimeout(recoveryTimerRef.current);
      window.removeEventListener("pageshow", resumeVideo);
      document.removeEventListener("visibilitychange", resumeWhenVisible);
    };
  }, [recoverVideo, restartVideo, resumeVideo]);

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
          disablePictureInPicture
          aria-label="Techanor technology showcase"
          tabIndex={-1}
          onCanPlay={resumeVideo}
          onWaiting={() => {
            if (recoveryTimerRef.current !== null) window.clearTimeout(recoveryTimerRef.current);
            recoveryTimerRef.current = window.setTimeout(recoverVideo, 3000);
          }}
          onPlaying={() => {
            if (recoveryTimerRef.current !== null) {
              window.clearTimeout(recoveryTimerRef.current);
              recoveryTimerRef.current = null;
            }
          }}
          onTimeUpdate={(event) => {
            const video = event.currentTarget;
            if (
              Number.isFinite(video.duration) &&
              video.duration > RESTART_BEFORE_END_SECONDS &&
              video.currentTime >= video.duration - RESTART_BEFORE_END_SECONDS
            ) {
              restartVideo();
            }
          }}
          onEnded={restartVideo}
        >
          <source src="/video/Odyssey G7 37   Official Introduction   Samsung_(0).mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
