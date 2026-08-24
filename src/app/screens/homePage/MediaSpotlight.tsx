import { useEffect, useState } from "react";

const SPOTLIGHT_DURATION_MS = 7000;

const spotlightStories = [
  {
    category: "Featured trailer",
    title: "A new story begins",
    description: "Watch the official trailer and experience the story before it arrives.",
    image: "https://img.youtube.com/vi/daXaTug8rL4/hqdefault.jpg",
    videoId: "daXaTug8rL4",
  },
  {
    category: "Official trailer",
    title: "The next chapter is here",
    description: "Step into the action with the latest official trailer.",
    image: "https://img.youtube.com/vi/Mzw2ttJD2qQ/hqdefault.jpg",
    videoId: "Mzw2ttJD2qQ",
  },
  {
    category: "Featured trailer",
    title: "A world beyond imagination",
    description: "Discover a new cinematic adventure in the official trailer.",
    image: "https://img.youtube.com/vi/Di310WS8zLk/hqdefault.jpg",
    videoId: "Di310WS8zLk",
  },
  {
    category: "Sponsored",
    title: "Featured by our partner",
    description: "Discover this week’s featured campaign from a Techanor advertising partner.",
    image: "https://img.youtube.com/vi/v6EjmbMgv80/hqdefault.jpg",
    videoId: "v6EjmbMgv80",
  },
];

export default function MediaSpotlight() {
  const [activeStory, setActiveStory] = useState(0);
  const [openVideo, setOpenVideo] = useState<string | null>(null);

  useEffect(() => {
    if (openVideo) return;

    const interval = window.setInterval(() => {
      setActiveStory((current) => (current + 1) % spotlightStories.length);
    }, SPOTLIGHT_DURATION_MS);

    return () => window.clearInterval(interval);
  }, [openVideo]);

  useEffect(() => {
    if (!openVideo) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenVideo(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [openVideo]);

  const story = spotlightStories[activeStory];
  const previousStory = (activeStory - 1 + spotlightStories.length) % spotlightStories.length;
  const nextStory = (activeStory + 1) % spotlightStories.length;
  const visibleStories = [previousStory, activeStory, nextStory];

  const changeStory = (direction: number) => {
    setActiveStory(
      (current) => (current + direction + spotlightStories.length) % spotlightStories.length
    );
  };

  return (
    <section className="media-spotlight" aria-labelledby="media-spotlight-title">
      <div className="media-spotlight__backdrop" aria-hidden="true">
        <img src={story.image} alt="" />
      </div>

      <div className="media-spotlight__container">
        <h2 className="media-spotlight__sr-title" id="media-spotlight-title">Sponsored Spotlight</h2>
        <div className="media-spotlight__cards">
          {visibleStories.map((storyIndex, position) => {
            const item = spotlightStories[storyIndex];
            return (
            <button
              className={`media-spotlight__card${position === 1 ? " active" : ""}`}
              type="button"
              key={item.title}
              onClick={() => {
                if (position === 1 && item.videoId) {
                  setOpenVideo(item.videoId);
                  return;
                }
                setActiveStory(storyIndex);
              }}
              aria-label={`Show ${item.title}`}
              aria-pressed={storyIndex === activeStory}
            >
              <img src={item.image} alt="" />
              <span className="media-spotlight__play" aria-hidden="true">▶</span>
            </button>
          )})}
        </div>

        <div className="media-spotlight__details" key={story.title}>
          <button className="media-spotlight__arrow" type="button" onClick={() => changeStory(-1)} aria-label="Previous spotlight">‹</button>
          <div className="media-spotlight__copy">
            <span>{story.category}</span>
            <h3>{story.title}</h3>
            <p>{story.description}</p>
          </div>

          <div className="media-spotlight__progress" aria-label={`Spotlight ${activeStory + 1} of ${spotlightStories.length}`}>
            <span>{String(activeStory + 1).padStart(2, "0")} / {String(spotlightStories.length).padStart(2, "0")}</span>
            <div aria-hidden="true">
              <i style={{ width: `${((activeStory + 1) / spotlightStories.length) * 100}%` }} />
            </div>
          </div>
          <button className="media-spotlight__arrow" type="button" onClick={() => changeStory(1)} aria-label="Next spotlight">›</button>
        </div>
      </div>

      {openVideo && (
        <div className="spotlight-modal" role="dialog" aria-modal="true" aria-label="Trailer player" onClick={() => setOpenVideo(null)}>
          <div className="spotlight-modal__player" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setOpenVideo(null)} aria-label="Close trailer">×</button>
            <iframe
              src={`https://www.youtube.com/embed/${openVideo}?autoplay=1&rel=0&modestbranding=1`}
              title="Featured official trailer"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
