import { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";
import "swiper/css";

import { BLOG_CATEGORY_LABELS } from "../../../constants/enums";
import { useAppDispatch, useAppSelector } from "../../hooks";
import BlogService from "../../services/BlogService";
import { formatBlogDate, getBlogExcerpt, getBlogMediaUrl } from "../blogPage/blogUtils";
import { retrieveBlogs } from "../blogPage/selector";
import { setBlogs } from "../blogPage/slice";

SwiperCore.use([Navigation]);

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

    new BlogService()
      .getBlogs({ page: 1, limit: RECENT_BLOG_LIMIT })
      .then((data) => {
        if (!isCancelled) dispatch(setBlogs(Array.isArray(data) ? data : []));
      })
      .catch(() => {
        if (!isCancelled) setHasError(true);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [dispatch]);

  const recentBlogs = blogs.slice(0, RECENT_BLOG_LIMIT);

  return (
    <section className="events-frame" aria-labelledby="stories-title">
      <Stack className="events-main">
        <Box component="header" className="events-text">
          <h2 id="stories-title">Latest blog posts</h2>
          <Box className="events-navigation" aria-label="Blog carousel controls">
            <button
              className="events-prev"
              type="button"
              aria-label="Previous blog posts"
              disabled={recentBlogs.length === 0}
              aria-controls="latest-blog-posts"
            >
              <ChevronLeftRoundedIcon />
            </button>
            <button
              className="events-next"
              type="button"
              aria-label="Next blog posts"
              disabled={recentBlogs.length === 0}
              aria-controls="latest-blog-posts"
            >
              <ChevronRightRoundedIcon />
            </button>
          </Box>
        </Box>

        {isLoading && (
          <div className="events-state" role="status">Loading the latest blog posts...</div>
        )}
        {!isLoading && hasError && recentBlogs.length === 0 && (
          <div className="events-state" role="alert">
            Recent blog posts are temporarily unavailable. Please try again later.
          </div>
        )}
        {!isLoading && !hasError && recentBlogs.length === 0 && (
          <div className="events-state">New blog posts will appear here.</div>
        )}

        {recentBlogs.length > 0 && (
          <Swiper
            id="latest-blog-posts"
            className="events-info"
            slidesPerView={1}
            spaceBetween={24}
            grabCursor
            watchOverflow
            navigation={{
              prevEl: ".events-prev",
              nextEl: ".events-next",
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
          >
            {recentBlogs.map((post) => {
              const image = getBlogMediaUrl(post.blogPostImage);
              const articleUrl = `/blog/${post._id}`;

              return (
                <SwiperSlide key={post._id} className="events-info-frame">
                  <Box component="article" className="events-article">
                    <Link
                      className="events-img"
                      to={articleUrl}
                      aria-label={`Read ${post.blogPostTitle}`}
                    >
                      {image ? (
                        <img src={image} alt={post.blogPostTitle} loading="lazy" />
                      ) : (
                        <span className="events-image-placeholder">Image unavailable</span>
                      )}
                    </Link>
                    <Stack className="events-desc">
                      <Box className="events-meta">
                        <span>{BLOG_CATEGORY_LABELS[post.blogPostCategory]}</span>
                        <time dateTime={post.createdAt}>{formatBlogDate(post.createdAt)}</time>
                      </Box>
                      <h3><Link to={articleUrl}>{post.blogPostTitle}</Link></h3>
                      <p className="events-excerpt">{getBlogExcerpt(post.blogPostContent)}</p>
                      <Link className="events-read-more" to={articleUrl}>
                        Read more
                        <span className="events-read-more__icon" aria-hidden="true">
                          <ChevronRightRoundedIcon className="events-read-more__chevron" />
                          <AddRoundedIcon className="events-read-more__plus" />
                        </span>
                      </Link>
                    </Stack>
                  </Box>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </Stack>
    </section>
  );
}
