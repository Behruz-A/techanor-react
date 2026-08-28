export default function VideoShowcase() {
  return (
    <section className="tech-video" aria-label="Techanor video showcase">
      <div className="tech-video__player">
        <iframe
          src="https://www.youtube-nocookie.com/embed/DhT7Ihopxt8?autoplay=1&mute=1&loop=1&playlist=DhT7Ihopxt8&start=0&end=25&controls=0&showinfo=0&autohide=1&rel=0&modestbranding=1&playsinline=1&disablekb=1&fs=0&iv_load_policy=3&cc_load_policy=0"
          title="Techanor technology showcase"
          allow="autoplay"
          referrerPolicy="strict-origin-when-cross-origin"
          tabIndex={-1}
        />
      </div>
      <div className="tech-video__shade" aria-hidden="true" />
      <div className="tech-video__content">
        <span>Techanor film</span>
        <h2>Technology in motion.</h2>
      </div>
    </section>
  );
}
