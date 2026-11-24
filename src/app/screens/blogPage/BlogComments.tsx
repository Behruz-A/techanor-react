import { FormEvent, useEffect, useRef, useState } from "react";
import { Box, Stack } from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { BlogComment } from "../../../lib/types/blog";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";
import { useAppDispatch, useAppSelector } from "../../hooks";
import BlogService from "../../services/BlogService";
import { formatBlogDate } from "./blogUtils";
import { retrieveComments } from "./selector";
import { addComment, appendComments, setComments } from "./slice";

const COMMENT_IDENTITY_KEY = "techanor-comment-identity";

function readSavedIdentity() {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(COMMENT_IDENTITY_KEY) || "null");
    if (saved && typeof saved === "object" && "name" in saved && "email" in saved && "website" in saved) {
      const identity = saved as Record<string, unknown>;
      if (typeof identity.name === "string" && typeof identity.email === "string" && typeof identity.website === "string") {
        return { name: identity.name, email: identity.email, website: identity.website, remember: true };
      }
    }
  } catch { /* Storage may be unavailable in a private browser. */ }
  return { name: "", email: "", website: "", remember: false };
}

export default function BlogComments({ postId }: { postId: string }) {
  const dispatch = useAppDispatch();
  const { list, total } = useAppSelector(retrieveComments);
  const [identity, setIdentity] = useState(readSavedIdentity);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<BlogComment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [retryKey, setRetryKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const active = useRef(true);

  useEffect(() => {
    active.current = true;
    return () => { active.current = false; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    dispatch(setComments({ list: [], total: 0 }));
    setIsLoading(true);
    setHasError(false);
    setPage(1);
    new BlogService().getComments(postId)
      .then((data) => { if (!cancelled) dispatch(setComments(data)); })
      .catch(() => { if (!cancelled) setHasError(true); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [dispatch, postId, retryKey]);

  const handleReply = (comment: BlogComment) => {
    setReplyTo(comment);
    formRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    formRef.current?.querySelector("textarea")?.focus({ preventScroll: true });
  };

  const handleLoadMore = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const data = await new BlogService().getComments(postId, page + 1);
      if (!active.current) return;
      dispatch(appendComments(data));
      setPage((value) => value + 1);
    } catch (err) {
      if (active.current) void sweetErrorHandling(err);
    } finally {
      if (active.current) setIsLoadingMore(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || isLoading || hasError) return;
    if (content.trim().length < 2 || identity.name.trim().length < 2) {
      void sweetErrorHandling("Please enter your name and a comment of at least two characters.");
      return;
    }
    setIsSubmitting(true);
    try {
      const comment = await new BlogService().createComment(postId, {
        name: identity.name.trim(), email: identity.email.trim(), content: content.trim(),
        ...(identity.website.trim() ? { website: identity.website.trim() } : {}),
        ...(replyTo ? { parentId: replyTo.parentId || replyTo._id } : {}),
      });
      if (!active.current) return;
      dispatch(addComment(comment));
      setContent("");
      setReplyTo(null);
      try {
        if (identity.remember) localStorage.setItem(COMMENT_IDENTITY_KEY, JSON.stringify({ name: identity.name, email: identity.email, website: identity.website }));
        else localStorage.removeItem(COMMENT_IDENTITY_KEY);
      } catch { /* Posting remains available when browser storage is blocked. */ }
      void sweetTopSmallSuccessAlert("Your comment has been posted.");
    } catch (err) {
      if (active.current) void sweetErrorHandling(err);
    } finally {
      if (active.current) setIsSubmitting(false);
    }
  };

  const renderComment = (comment: BlogComment, isReply = false) => (
    <Box component="article" className={`journal-comment${isReply ? " journal-comment--reply" : ""}`} key={comment._id}>
      <img src="/img/default-user.png" alt="" loading="lazy" />
      <Stack className="journal-comment__body">
        <time dateTime={comment.createdAt}>{formatBlogDate(comment.createdAt)}</time>
        <h3>{comment.name}</h3>
        <p>{comment.content}</p>
        <button type="button" className="journal-text-link" onClick={() => handleReply(comment)}>
          Reply to <ChevronRightRoundedIcon />
        </button>
      </Stack>
    </Box>
  );

  const roots = list.filter((comment) => !comment.parentId || !list.some((item) => item._id === comment.parentId));

  return (
    <section className="journal-comments" aria-labelledby="journal-comments-title">
      <h2 id="journal-comments-title">{total} {total === 1 ? "Comment" : "Comments"}</h2>
      {isLoading && <p role="status">Loading comments...</p>}
      {!isLoading && hasError && <div role="alert"><p>Comments could not be loaded.</p><button type="button" className="journal-text-link" onClick={() => setRetryKey((value) => value + 1)}>Try again</button></div>}
      {!isLoading && !hasError && list.length === 0 && <p>Be the first to share your thoughts.</p>}
      <Stack className="journal-comments__list">
        {roots.map((comment) => <div key={comment._id}>
          {renderComment(comment)}
          {list.filter((reply) => reply.parentId === comment._id).map((reply) => renderComment(reply, true))}
        </div>)}
      </Stack>
      {list.length < total && <button type="button" className="journal-text-link" disabled={isLoadingMore} onClick={handleLoadMore}>{isLoadingMore ? "Loading..." : "Load more comments"}</button>}
      <Box component="form" className="journal-reply-form" ref={formRef} onSubmit={handleSubmit}>
        <h2>{replyTo ? `Reply to ${replyTo.name}` : "Leave a Reply"}</h2>
        <p>Your email address will not be published. Required fields are marked *</p>
        {replyTo && <button type="button" className="journal-text-link" onClick={() => setReplyTo(null)}>Cancel reply</button>}
        <textarea aria-label="Your comment" placeholder="Your Comment *" required minLength={2} maxLength={3000} value={content} onChange={(event) => setContent(event.target.value)} />
        <input aria-label="Your name" placeholder="Your Name *" autoComplete="name" required minLength={2} maxLength={80} value={identity.name} onChange={(event) => setIdentity({ ...identity, name: event.target.value })} />
        <input aria-label="Your email" placeholder="Your Email *" type="email" autoComplete="email" required maxLength={254} value={identity.email} onChange={(event) => setIdentity({ ...identity, email: event.target.value })} />
        <input aria-label="Your website" placeholder="Website" type="url" autoComplete="url" maxLength={500} value={identity.website} onChange={(event) => setIdentity({ ...identity, website: event.target.value })} />
        <label className="journal-save-identity"><input type="checkbox" checked={identity.remember} onChange={(event) => {
          const remember = event.target.checked;
          setIdentity({ ...identity, remember });
          if (!remember) { try { localStorage.removeItem(COMMENT_IDENTITY_KEY); } catch { /* Storage is optional. */ } }
        }} />Save my name, email, and website in this browser for the next time I comment.</label>
        <button className="journal-submit" type="submit" disabled={isSubmitting || isLoading || hasError}>{isSubmitting ? "Posting..." : "Post comment"}<ChevronRightRoundedIcon /></button>
      </Box>
    </section>
  );
}
