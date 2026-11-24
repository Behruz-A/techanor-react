import { useEffect, useMemo, useState } from "react";
import { Box, Stack } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { BLOG_CATEGORY_LABELS } from "../../../constants/enums";
import BrandLogo from "../../components/BrandLogo";
import BlogService from "../../services/BlogService";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { retrieveBlogs, retrieveChosenBlog } from "./selector";
import { setBlogs, setChosenBlog } from "./slice";
import { formatBlogDate, getBlogMediaUrl } from "./blogUtils";
import ArticleContent from "./ArticleContent";
import BlogComments from "./BlogComments";
import BlogSidebar from "./BlogSidebar";
import "../../../css/blog.css";
import "../../../css/blogDetail.css";

export default function BlogDetail() {
  const { postId } = useParams<{ postId: string }>();
  const dispatch = useAppDispatch();
  const blogs = useAppSelector(retrieveBlogs);
  const post = useAppSelector(retrieveChosenBlog);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);
    dispatch(setChosenBlog(null));
    const service = new BlogService();
    service.getBlog(postId)
      .then((data) => { if (!cancelled) dispatch(setChosenBlog(data)); })
      .catch(() => { if (!cancelled) setHasError(true); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    service.getBlogs({ page: 1, limit: 50 })
      .then((data) => { if (!cancelled) dispatch(setBlogs(data)); })
      .catch(() => { /* The article remains readable if related posts cannot load. */ });
    return () => { cancelled = true; };
  }, [dispatch, postId, retryKey]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return blogs.filter((item) => item._id !== post._id)
      .sort((a, b) => Number(b.blogPostCategory === post.blogPostCategory) - Number(a.blogPostCategory === post.blogPostCategory))
      .slice(0, 4);
  }, [blogs, post]);

  if (isLoading || (post && post._id !== postId)) return <main className="journal-detail"><div className="journal-state" role="status"><span className="blog-loader" /><h1>Loading article</h1></div></main>;
  if (hasError || !post) return <main className="journal-detail"><div className="journal-state"><h1>This story could not be loaded.</h1><button className="journal-submit" type="button" onClick={() => setRetryKey((value) => value + 1)}>Try again</button><Link to="/blog">Back to all articles</Link></div></main>;

  const image = getBlogMediaUrl(post.blogPostImage);
  const category = BLOG_CATEGORY_LABELS[post.blogPostCategory];
  const categoryUrl = `/blog?${new URLSearchParams({ category: post.blogPostCategory }).toString()}`;
  const postIndex = blogs.findIndex((item) => item._id === postId);
  const previous = postIndex >= 0 ? blogs[postIndex + 1] : undefined;
  const next = postIndex > 0 ? blogs[postIndex - 1] : undefined;
  const shareUrl = encodeURIComponent(window.location.href);

  return (
    <main className="journal-detail">
      <div className="journal-container">
        <Box component="nav" className="journal-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link><Link to={categoryUrl}>{category}</Link><span aria-current="page">{post.blogPostTitle}</span>
        </Box>
        <Box className="journal-layout">
          <div className="journal-main">
            <Box component="article" className="journal-article">
              <figure className="journal-cover">{image ? <img src={image} alt={post.blogPostTitle} /> : <span className="blog-image-placeholder">Image unavailable</span>}</figure>
              <header className="journal-heading">
                <div className="journal-meta"><Link to={categoryUrl}>{category}</Link><time dateTime={post.createdAt}>{formatBlogDate(post.createdAt)}</time></div>
                <h1>{post.blogPostTitle}</h1>
              </header>
              <ArticleContent content={post.blogPostContent} />
              {post.blogPostVideo && <video className="journal-video" controls preload="metadata" src={getBlogMediaUrl(post.blogPostVideo)} />}
              <Box className="journal-article-footer">
                <Link to={categoryUrl}>{category}</Link>
                <div className="journal-share" aria-label="Share this article">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook"><FacebookIcon /></a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn"><LinkedInIcon /></a>
                </div>
              </Box>
              <Stack className="journal-author">
                <div className="journal-author__logo"><BrandLogo tone="dark" /></div>
                <div><span>Author</span><h2>Techanor Editorial</h2><p>Technology, product guides, and ideas for everyday life from the Techanor team.</p></div>
              </Stack>
            </Box>
            <Box component="nav" className="journal-post-navigation" aria-label="Article navigation">
              {previous ? <Link to={`/blog/${previous._id}`} aria-label={`Previous article: ${previous.blogPostTitle}`}><ChevronLeftRoundedIcon /></Link> : <span />}
              {next ? <Link to={`/blog/${next._id}`} aria-label={`Next article: ${next.blogPostTitle}`}><ChevronRightRoundedIcon /></Link> : <span />}
            </Box>
            <BlogComments key={postId} postId={postId} />
          </div>
          <BlogSidebar relatedPosts={relatedPosts} />
        </Box>
      </div>
    </main>
  );
}
