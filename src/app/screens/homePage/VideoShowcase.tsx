export default function VideoShowcase() {
  return (
    <section className="tech-video" aria-label="Techanor video showcase">
      <div className="tech-video__player">
        <iframe
          src="https://www.youtube.com/embed/DhT7Ihopxt8?autoplay=1&mute=1&loop=1&playlist=DhT7Ihopxt8&controls=0&rel=0&modestbranding=1&playsinline=1"
          title="Techanor technology showcase"
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <div className="tech-video__shade" aria-hidden="true" />
      <div className="tech-video__content">
        <span>Techanor film</span>
        <h2>Technology in motion.</h2>
        <a href="https://youtu.be/DhT7Ihopxt8" target="_blank" rel="noreferrer">
          <span aria-hidden="true">▶</span> Watch with sound
        </a>
      </div>
    </section>
  );
}
