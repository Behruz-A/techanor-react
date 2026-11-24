import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import { BlogPostCategory, BLOG_CATEGORY_LABELS } from "../../../constants/enums";
import BlogService from "../../services/BlogService";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { retrieveBlogs } from "./selector";
import { setBlogs } from "./slice";
import { formatBlogDate, getBlogExcerpt, getBlogMediaUrl, getBlogReadTime } from "./blogUtils";
import "../../../css/blog.css";
import "../../../css/blogIndex.css";

const categories = Object.values(BlogPostCategory);

export default function BlogPage() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const blogs = useAppSelector(retrieveBlogs);
  const [category, setCategory] = useState<BlogPostCategory | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    setSearch(params.get("search") || "");
    setCategory(categories.find((item) => item === categoryParam) || "ALL");
  }, [location.search]);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setHasError(false);
    new BlogService().getBlogs({ page: 1, limit: 50 })
      .then((data) => { if (!isCancelled) dispatch(setBlogs(Array.isArray(data) ? data : [])); })
      .catch(() => { if (!isCancelled) { dispatch(setBlogs([])); setHasError(true); } })
      .finally(() => { if (!isCancelled) setIsLoading(false); });
    return () => { isCancelled = true; };
  }, [dispatch, retryKey]);

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return blogs.filter((post) => {
      const categoryMatches = category === "ALL" || post.blogPostCategory === category;
      const searchMatches = !normalizedSearch || `${post.blogPostTitle} ${post.blogPostContent}`.toLowerCase().includes(normalizedSearch);
      return categoryMatches && searchMatches;
    });
  }, [blogs, category, search]);

  return <main className="blog-page">
    <div className="blog-shell blog-shell-index">
      <nav className="blog-index-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link><span aria-hidden="true">&rsaquo;</span><strong aria-current="page">Blog</strong>
      </nav>
      <header className="blog-index-heading">
        <h1>{category === "ALL" ? "All Articles" : BLOG_CATEGORY_LABELS[category]}</h1>
        {!hasError && <p className="blog-index-count"><strong>{isLoading ? "\u2014" : filtered.length}</strong> articles</p>}
      </header>
      <section className="blog-content" aria-label="Articles">
        <div className="blog-index-toolbar">
          <label className="blog-search"><SearchRounded aria-hidden="true"/><input type="search" aria-label="Search articles" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search articles..."/></label>
        </div>
        <div className="blog-categories" aria-label="Filter stories by category"><button type="button" className={category === "ALL" ? "active" : ""} aria-pressed={category === "ALL"} onClick={() => setCategory("ALL")}>All</button>{categories.map((item) => <button type="button" className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)} key={item}>{BLOG_CATEGORY_LABELS[item]}</button>)}</div>
        {!isLoading && !hasError && <div className="blog-grid">{filtered.map((post) => {
          const image = getBlogMediaUrl(post.blogPostImage);
          return <article className="blog-card" data-category={post.blogPostCategory} key={post._id}><Link className="blog-card-image" to={`/blog/${post._id}`}>{image ? <img src={image} alt={post.blogPostTitle} loading="lazy"/> : <span className="blog-image-placeholder">Image unavailable</span>}</Link><div><span className="blog-category">{BLOG_CATEGORY_LABELS[post.blogPostCategory]}</span><Link className="blog-title-link" to={`/blog/${post._id}`}><h3>{post.blogPostTitle}</h3></Link><p>{getBlogExcerpt(post.blogPostContent)}</p><div className="blog-meta"><span>{formatBlogDate(post.createdAt)}</span><span><AccessTimeRounded/>{getBlogReadTime(post.blogPostContent)}</span></div><Link className="blog-card-read-more" to={`/blog/${post._id}`} aria-label={`Read ${post.blogPostTitle}`}>Read article <ArrowForwardRounded/></Link></div></article>;
        })}</div>}
        {isLoading && <div className="blog-empty" role="status"><span className="blog-loader"/><h3>Loading stories</h3><p>Preparing the latest Techanor articles.</p></div>}
        {!isLoading && hasError && <div className="blog-empty"><h3>Stories are temporarily unavailable</h3><p>Please try again.</p><button type="button" onClick={() => setRetryKey((value) => value + 1)}>Try again</button></div>}
        {!isLoading && !hasError && filtered.length === 0 && <div className="blog-empty"><h3>No stories found</h3><p>Try another category or search phrase.</p></div>}
      </section>
    </div>
  </main>;
}
