import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

SwiperCore.use([Autoplay, Navigation, Pagination]);

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
          <h2 id="stories-title">Exclusive Events</h2>
          <p>Discover launches, showcases, and stories shaping tomorrow&apos;s technology.</p>
        </header>

        <Swiper
          className="events-info"
          grabCursor
          loop
          slidesPerView={1}
          speed={700}
          navigation={{
            nextEl: ".events-next",
            prevEl: ".events-prev",
          }}
          pagination={{
            el: ".events-pagination",
            clickable: true,
          }}
          autoplay={{
            delay: 4200,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
            waitForTransition: true,
          }}
        >
          {stories.map((story) => (
            <SwiperSlide key={story.title} className="events-info-frame">
              <Link className="story-card" to="/blog" aria-label={`Read ${story.title}`}>
                <div className="story-card__image">
                  <img src={story.image} alt={story.title} loading="lazy" />
                </div>
                <div className="story-card__body">
                  <div className="story-card__meta">
                    <span>{story.category}</span>
                    <time>{story.date}</time>
                  </div>
                  <h3>{story.title}</h3>
                  <span className="story-card__link">Discover story <b aria-hidden="true">&rarr;</b></span>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="events-controls">
          <button className="events-prev" type="button" aria-label="Previous story">&larr;</button>
          <div className="events-pagination" />
          <button className="events-next" type="button" aria-label="Next story">&rarr;</button>
        </div>
      </div>
    </section>
  );
}
