import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

SwiperCore.use([Autoplay, EffectCoverflow, Navigation, Pagination]);

const stories = [
  { title: "The next fold is here", category: "Mobile", date: "Today", image: "/img/samsunggalaxy.jpg" },
  { title: "Sound without limits", category: "Audio", date: "2 days ago", image: "/img/testheadphone.avif" },
  { title: "Power meets portability", category: "Computing", date: "4 days ago", image: "/img/mackboooook.jpg" },
  { title: "A smarter everyday", category: "Wearables", date: "A week ago", image: "/img/watchhomenavbar.jpg" },
  { title: "Capture every detail", category: "Cameras", date: "A week ago", image: "/img/camerabanner.jpg" },
];

export default function Events() {
  return (
    <section className="events-frame" aria-labelledby="stories-title">
      <div className="events-main">
        <header className="events-text">
          <span>Always active</span>
          <h2 id="stories-title">Exclusive Stories</h2>
          <p>Explore what&apos;s new across the world of technology.</p>
        </header>

        <Swiper
          className="events-info"
          effect="coverflow"
          grabCursor
          centeredSlides
          loop
          loopedSlides={5}
          loopAdditionalSlides={5}
          slidesPerView="auto"
          speed={12000}
          coverflowEffect={{
            rotate: 7,
            stretch: 15,
            depth: 180,
            modifier: 1.15,
            slideShadows: false,
          }}
          navigation={{
            nextEl: ".events-next",
            prevEl: ".events-prev",
          }}
          pagination={{
            el: ".events-pagination",
            clickable: true,
          }}
          autoplay={{
            delay: 1,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
            waitForTransition: true,
            reverseDirection: false,
          }}
        >
          {stories.map((story) => (
            <SwiperSlide key={story.title} className="events-info-frame">
              <article className="story-card">
                <div className="story-card__image">
                  <img src={story.image} alt={story.title} loading="lazy" />
                </div>
                <div className="story-card__body">
                  <div className="story-card__meta">
                    <span>{story.category}</span>
                    <time>{story.date}</time>
                  </div>
                  <h3>{story.title}</h3>
                  <span className="story-card__link">Discover story <b aria-hidden="true">→</b></span>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="events-controls">
          <button className="events-prev" type="button" aria-label="Previous story">←</button>
          <div className="events-pagination" />
          <button className="events-next" type="button" aria-label="Next story">→</button>
        </div>
      </div>
    </section>
  );
}
