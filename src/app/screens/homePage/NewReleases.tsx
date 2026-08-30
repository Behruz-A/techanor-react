import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const showcaseImages = [
  { id: "watch", image: "/img/iwatch.jpg", alt: "Premium silver smartwatch", shift: 90 },
  { id: "speaker", image: "/img/headphonenew.jpg", alt: "Premium silver wireless headphones", shift: -122 },
  { id: "future", image: "/img/futuristicimg.png", alt: "Person exploring virtual reality technology", shift: 0, focal: true },
  { id: "laptop", image: "/img/mackboooook.jpg", alt: "Premium silver laptop", shift: 90 },
  { id: "phone", image: "/img/newsamsungphone.jpg", alt: "Latest silver foldable smartphone", shift: -150 },
];

export default function NewReleases() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;

    const updateGallery = () => {
      animationFrame = 0;
      const gallery = section.querySelector<HTMLElement>(".release-editorial");
      if (!gallery) return;

      const galleryRect = gallery.getBoundingClientRect();
      const animationStart = window.innerHeight * 0.52;
      const scrollRange = window.innerHeight * 0.44;
      const progress = Math.min(1, Math.max(0, (animationStart - galleryRect.top) / scrollRange));

      section.querySelectorAll<HTMLElement>("[data-release-shift]").forEach((card) => {
        const shift = Number(card.dataset.releaseShift || 0);
        card.style.setProperty("--release-scroll-y", reducedMotion.matches ? "0px" : `${shift * progress}px`);
      });
    };

    const requestUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateGallery);
    };

    updateGallery();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
    };
  }, []);

  return (
    <section ref={sectionRef} className="new-releases new-releases--editorial" aria-labelledby="new-releases-title">
      <div className="new-releases__editorial-container">
        <header className="new-releases__editorial-heading">
          <span>DISCOVER THE LATEST</span>
          <h2 id="new-releases-title">Explore What’s New</h2>
          <p>Discover the latest technology designed to upgrade how you work, play, and connect.</p>
          <Link to="/products">Explore New Arrivals <span aria-hidden="true">→</span></Link>
        </header>

        <div className="release-editorial" aria-label="Latest technology showcase">
          {showcaseImages.map(({ id, image, alt, shift, focal }) => (
            <Link
              className={`release-editorial__card release-editorial__card--${id}${focal ? " release-editorial__card--focal" : ""}`}
              data-release-shift={shift}
              to="/products"
              aria-label={`Explore new arrivals: ${alt}`}
              key={id}
            >
              <img src={image} alt={alt} loading={focal ? "eager" : "lazy"} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
