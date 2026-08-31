import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import { BLOG_CATEGORY_LABELS } from "../../../constants/enums";
import BrandLogo from "../../components/BrandLogo";
import BlogService from "../../services/BlogService";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { retrieveBlogs, retrieveChosenBlog } from "./selector";
import { setBlogs, setChosenBlog } from "./slice";
import { formatBlogDate, getBlogExcerpt, getBlogMediaUrl, getBlogReadTime, parseArticleContent } from "./blogUtils";
import "../../../css/blog.css";

export default function BlogDetail() {
  const { postId } = useParams<{ postId: string }>();
  const dispatch = useAppDispatch();
  const blogs = useAppSelector(retrieveBlogs);
  const post = useAppSelector(retrieveChosenBlog);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!postId) return;
    let isCancelled = false;
    setIsLoading(true);
    setHasError(false);
    dispatch(setChosenBlog(null));
    const service = new BlogService();

    Promise.all([
      service.getBlog(postId),
      service.getBlogs({ page: 1, limit: 50 }),
    ])
      .then(([chosenBlog, publishedBlogs]) => {
        if (isCancelled) return;
        dispatch(setChosenBlog(chosenBlog));
        dispatch(setBlogs(Array.isArray(publishedBlogs) ? publishedBlogs : []));
      })
      .catch(() => { if (!isCancelled) setHasError(true); })
      .finally(() => { if (!isCancelled) setIsLoading(false); });

    return () => { isCancelled = true; };
  }, [dispatch, postId, retryKey]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return blogs
      .filter((item) => item._id !== post._id)
      .sort((a, b) => Number(b.blogPostCategory === post.blogPostCategory) - Number(a.blogPostCategory === post.blogPostCategory))
      .slice(0, 3);
  }, [blogs, post]);

  if (isLoading) return <main className="blog-detail-page"><div className="blog-not-found" role="status"><span className="blog-loader"/><h1>Loading article</h1><p>Preparing the Techanor Journal story.</p></div></main>;
  if (hasError || !post) return <main className="blog-detail-page"><div className="blog-not-found"><span>ARTICLE UNAVAILABLE</span><h1>This story could not be loaded.</h1><div className="blog-error-actions"><button type="button" onClick={() => setRetryKey((value) => value + 1)}>Try again</button><Link to="/blog"><ArrowBackRounded/>Back to Journal</Link></div></div></main>;

  const titleWords = post.blogPostTitle.split(" ");
  const titleBreak = Math.ceil(titleWords.length / 2);
  const titlePrimary = titleWords.slice(0, titleBreak).join(" ");
  const titleAccent = titleWords.slice(titleBreak).join(" ");
  const article = parseArticleContent(post.blogPostContent);
  const formattedDate = formatBlogDate(post.createdAt);
  const readTime = getBlogReadTime(post.blogPostContent);
  const coverImage = getBlogMediaUrl(post.blogPostImage);

  return <main className="blog-detail-page">
    <header className="article-header"><div><Link to="/blog"><ArrowBackRounded/>Techanor Journal</Link><span>{BLOG_CATEGORY_LABELS[post.blogPostCategory]}</span><h1>{titlePrimary}{titleAccent && <> <em>{titleAccent}</em></>}</h1><p>{getBlogExcerpt(post.blogPostContent, 210)}</p><div className="blog-meta"><span>{formattedDate}</span><span><AccessTimeRounded/>{readTime}</span><span>By Techanor Store</span></div></div></header>
    <article className="article-body" data-category={post.blogPostCategory}><div className="article-content-card"><figure className="article-cover-frame">{coverImage ? <img className="article-cover" src={coverImage} alt={post.blogPostTitle}/> : <span className="blog-image-placeholder">Image unavailable</span>}</figure><div className="article-prose"><div className="article-intro-label">EDITORIAL</div><p className="article-lead">{article.lead}</p>{article.sections.map((section, index) => <section className="article-section" key={`${section.heading || "section"}-${index}`}>{section.heading && <h2>{section.heading}</h2>}{section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</section>)}<aside><strong>Techanor perspective</strong><p>Choose technology for the experience it creates every day, not only for the specification printed on the box.</p></aside><footer className="article-author"><div className="article-author-logo"><span className="article-author-logo-inner"><BrandLogo tone="dark" /></span></div><div><strong>Techanor Editorial</strong><span>Technology &amp; Product Guides</span><small>Published {formattedDate}</small></div></footer></div></div>
      <nav className="article-navigation" aria-label="Article navigation"><Link className="back-articles" to="/blog"><ArrowBackRounded/><span>Back to all articles</span></Link></nav>
    </article>
    {relatedPosts.length > 0 && <section className="related-stories" aria-labelledby="related-stories-title"><header><span>KEEP READING</span><h2 id="related-stories-title">Related Stories</h2></header><div className="related-stories-grid">{relatedPosts.map((related) => {
      const image = getBlogMediaUrl(related.blogPostImage);
      return <article className="related-story" data-category={related.blogPostCategory} key={related._id}><Link className="related-story-image" to={`/blog/${related._id}`}>{image ? <img src={image} alt={related.blogPostTitle} loading="lazy"/> : <span className="blog-image-placeholder">Image unavailable</span>}</Link><div><span className="blog-category">{BLOG_CATEGORY_LABELS[related.blogPostCategory]}</span><Link className="related-story-title" to={`/blog/${related._id}`}><h3>{related.blogPostTitle}</h3></Link><div className="blog-meta"><span>{formatBlogDate(related.createdAt)}</span><span><AccessTimeRounded/>{getBlogReadTime(related.blogPostContent)}</span></div><Link className="related-story-link" to={`/blog/${related._id}`}>Read article <ArrowForwardRounded/></Link></div></article>;
    })}</div></section>}
  </main>;
}
