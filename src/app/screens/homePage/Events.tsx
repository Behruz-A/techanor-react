import { Link } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";

SwiperCore.use([Navigation, Scrollbar]);

const stories = [
  { title: "How to Build a Better Everyday Audio Setup", date: "Aug 28, 2026", readTime: "5 min read", image: "/img/testheadphone.avif" },
  { title: "The Smart Devices Worth Adding to Your Home", date: "Aug 24, 2026", readTime: "6 min read", image: "/img/samsunggalaxy.jpg" },
  { title: "How to Choose the Right Gaming Setup", date: "Aug 19, 2026", readTime: "7 min read", image: "/img/gamingimg.jpg" },
  { title: "A Smarter Way to Work Anywhere", date: "Aug 15, 2026", readTime: "5 min read", image: "/img/mackboooook.jpg" },
  { title: "What Makes a Great Everyday Phone", date: "Aug 11, 2026", readTime: "4 min read", image: "/img/iphone17silver.jpg" },
  { title: "Capture the Details That Matter", date: "Aug 7, 2026", readTime: "6 min read", image: "/img/cameraimg.jpg" },
];

export default function Events() {
  return (
    <section className="events-frame" aria-labelledby="stories-title">
      <div className="events-main">
        <header className="events-text">
          <div><span>Tips and news</span><h2 id="stories-title">Recent News and Resources</h2></div>
          <Link className="events-view-all" to="/blog">View all <span><ArrowForwardRoundedIcon /></span></Link>
        </header>

        <Swiper
          className="events-info"
          slidesPerView={1.15}
          spaceBetween={14}
          grabCursor
          navigation={{ prevEl: ".events-prev", nextEl: ".events-next" }}
          scrollbar={{ el: ".events-progress", draggable: true }}
          breakpoints={{
            600: { slidesPerView: 2.2, spaceBetween: 18 },
            980: { slidesPerView: 3, spaceBetween: 20 },
            1200: { slidesPerView: 3.5, spaceBetween: 22 },
          }}
        >
          {stories.map((story) => (
            <SwiperSlide key={story.title}>
              <article className="story-card">
                <Link className="story-card__image" to="/blog" aria-label={`Read ${story.title}`}><img src={story.image} alt={story.title} loading="lazy" /></Link>
                <div className="story-card__body">
                  <div className="story-card__meta"><time>{story.date}</time><span aria-hidden="true" /><small>{story.readTime}</small></div>
                  <h3><Link to="/blog">{story.title}</Link></h3>
                  <Link className="story-card__link" to="/blog">Read more <ArrowForwardRoundedIcon /></Link>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="events-controls"><div className="events-progress" /><div><button className="events-prev" type="button" aria-label="Previous stories"><ArrowBackRoundedIcon /></button><button className="events-next" type="button" aria-label="Next stories"><ArrowForwardRoundedIcon /></button></div></div>
      </div>
    </section>
  );
}
