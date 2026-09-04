import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";

import { BLOG_CATEGORY_LABELS } from "../../../constants/enums";
import { useAppDispatch, useAppSelector } from "../../hooks";
import BlogService from "../../services/BlogService";
import { formatBlogDate, getBlogMediaUrl, getBlogReadTime } from "../blogPage/blogUtils";
import { retrieveBlogs } from "../blogPage/selector";
import { setBlogs } from "../blogPage/slice";

SwiperCore.use([Navigation, Scrollbar]);

const RECENT_BLOG_LIMIT = 5;

export default function Events() {
  const dispatch = useAppDispatch();
  const blogs = useAppSelector(retrieveBlogs);
  const [isLoading, setIsLoading] = useState(blogs.length === 0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setHasError(false);
    new BlogService().getBlogs({ page: 1, limit: RECENT_BLOG_LIMIT })
      .then((data) => { if (!isCancelled) dispatch(setBlogs(Array.isArray(data) ? data : [])); })
      .catch(() => { if (!isCancelled) setHasError(true); })
      .finally(() => { if (!isCancelled) setIsLoading(false); });
    return () => { isCancelled = true; };
  }, [dispatch]);

  const recentBlogs = blogs.slice(0, RECENT_BLOG_LIMIT);

  return (
    <section className="events-frame" aria-labelledby="stories-title">
      <div className="events-main">
        <header className="events-text">
          <div><span>Tips and news</span><h2 id="stories-title">Recent News and Resources</h2></div>
          <Link className="events-view-all" to="/blog">View all articles <ArrowForwardRoundedIcon /></Link>
        </header>

        {isLoading && <div className="events-state" role="status">Loading the latest stories...</div>}
        {!isLoading && hasError && recentBlogs.length === 0 && <div className="events-state">Recent stories are temporarily unavailable.</div>}
        {!isLoading && !hasError && recentBlogs.length === 0 && <div className="events-state">New stories will appear here.</div>}
        {recentBlogs.length > 0 && <>
          <Swiper className="events-info" slidesPerView={1.08} spaceBetween={14} grabCursor navigation={{ prevEl: ".events-prev", nextEl: ".events-next" }} scrollbar={{ el: ".events-progress", draggable: true }} breakpoints={{ 600: { slidesPerView: 2.18, spaceBetween: 18 }, 980: { slidesPerView: 3.2, spaceBetween: 20 }, 1200: { slidesPerView: 3.2, spaceBetween: 22 } }}>
            {recentBlogs.map((post) => {
              const image = getBlogMediaUrl(post.blogPostImage);
              return <SwiperSlide key={post._id}><article className="story-card">
                <Link className="story-card__image" to={`/blog/${post._id}`} aria-label={`Read ${post.blogPostTitle}`}>{image ? <img src={image} alt={post.blogPostTitle} loading="lazy"/> : <span className="blog-image-placeholder">Image unavailable</span>}</Link>
                <div className="story-card__body"><span className="story-card__category">{BLOG_CATEGORY_LABELS[post.blogPostCategory]}</span><div className="story-card__meta"><time>{formatBlogDate(post.createdAt)}</time><span aria-hidden="true"/><small>{getBlogReadTime(post.blogPostContent)}</small></div><h3><Link to={`/blog/${post._id}`}>{post.blogPostTitle}</Link></h3><Link className="story-card__link" to={`/blog/${post._id}`}>Read article <ArrowForwardRoundedIcon/></Link></div>
              </article></SwiperSlide>;
            })}
          </Swiper>
          <div className="events-controls"><div className="events-progress"/><div><button className="events-prev" type="button" aria-label="Previous stories"><ArrowBackRoundedIcon/></button><button className="events-next" type="button" aria-label="Next stories"><ArrowForwardRoundedIcon/></button></div></div>
        </>}
      </div>
    </section>
  );
}
