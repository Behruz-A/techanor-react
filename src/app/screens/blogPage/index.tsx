import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import { BlogPostCategory, BlogPostStatus, BLOG_CATEGORY_LABELS } from "../../../constants/enums";
import "../../../css/blog.css";

type BlogPost = { id:string; title:string; excerpt:string; image:string; category:BlogPostCategory; status:BlogPostStatus; date:string; readTime:string; featured?:boolean };

export const posts: BlogPost[] = [
  { id:"future-workspace", title:"Building a Smarter Everyday Workspace", excerpt:"A considered guide to choosing devices that work beautifully together—from your primary computer to the audio and accessories around it.", image:"/img/aritclebanner.png", category:BlogPostCategory.RECOMMENDED, status:BlogPostStatus.PUBLISHED, date:"August 24, 2026", readTime:"7 min read", featured:true },
  { id:"phone-guide", title:"What Really Matters When Choosing Your Next Phone", excerpt:"Beyond megapixels and marketing: the display, battery, performance and support details worth comparing before you buy.", image:"/img/samsungphone.jpg", category:BlogPostCategory.PRODUCT_GUIDE, status:BlogPostStatus.PUBLISHED, date:"August 21, 2026", readTime:"6 min read" },
  { id:"laptop-performance", title:"A Practical Guide to Laptop Performance", excerpt:"Understand processors, memory and storage without getting lost in specifications—and find the right balance for your work.", image:"/img/Asuslaptop.jpg", category:BlogPostCategory.HOW_TO, status:BlogPostStatus.PUBLISHED, date:"August 18, 2026", readTime:"8 min read" },
  { id:"headphones-review", title:"Studio Wireless Headphones: Long-Term Review", excerpt:"Comfort, sound, battery life and noise cancellation after weeks of daily listening and long work sessions.", image:"/img/headphonenew.jpg", category:BlogPostCategory.REVIEWS, status:BlogPostStatus.PUBLISHED, date:"August 15, 2026", readTime:"5 min read" },
  { id:"gaming-technology", title:"The Technology Shaping Modern Gaming", excerpt:"How faster displays, responsive peripherals and efficient hardware are changing the way we play.", image:"/img/gamingimg.jpg", category:BlogPostCategory.TECHNOLOGY, status:BlogPostStatus.PUBLISHED, date:"August 11, 2026", readTime:"6 min read" },
  { id:"camera-news", title:"Compact Cameras Are Finding Their Place Again", excerpt:"Creators are rediscovering dedicated cameras for their character, control and distraction-free shooting experience.", image:"/img/cameraimg.jpg", category:BlogPostCategory.NEWS, status:BlogPostStatus.PUBLISHED, date:"August 7, 2026", readTime:"4 min read" },
  { id:"watch-humor", title:"Seven Notifications Your Smartwatch Takes Too Seriously", excerpt:"A light look at the tiny wrist reminders that somehow manage to run our entire day.", image:"/img/iwatch.jpg", category:BlogPostCategory.HUMOR, status:BlogPostStatus.PUBLISHED, date:"August 3, 2026", readTime:"3 min read" },
];

const categories = Object.values(BlogPostCategory);
export const publishedPosts = posts.filter((post) => post.status === BlogPostStatus.PUBLISHED);

export default function BlogPage() {
  const [category, setCategory] = useState<BlogPostCategory | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => publishedPosts.filter((post) => (category === "ALL" || post.category === category) && `${post.title} ${post.excerpt}`.toLowerCase().includes(search.toLowerCase())), [category, search]);

  return <main className="blog-page">
    <div className="blog-shell blog-shell-index">
      <header className="blog-index-intro"><span><Link to="/">Home</Link><b>›</b> TECHANOR Journal</span><h1>Ideas for a <em>smarter everyday.</em></h1></header>
      <section className="blog-content">
        <header className="blog-latest-header"><div><span>THE LATEST</span><h2>{category === "ALL" ? "Latest stories" : BLOG_CATEGORY_LABELS[category]}</h2></div><label className="blog-search"><SearchRounded/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search stories"/></label></header>
        <div className="blog-categories" aria-label="Filter stories by category"><button className={category === "ALL" ? "active" : ""} onClick={()=>setCategory("ALL")}>All</button>{categories.map((item)=><button className={category === item ? "active" : ""} onClick={()=>setCategory(item)} key={item}>{BLOG_CATEGORY_LABELS[item]}</button>)}</div>
        <div className="blog-grid">{filtered.map((post) => <article className="blog-card" data-category={post.category} key={post.id}><Link className="blog-card-image" to={`/blog/${post.id}`}><img src={post.image} alt={post.title}/></Link><div><span className="blog-category">{BLOG_CATEGORY_LABELS[post.category]}</span><Link className="blog-title-link" to={`/blog/${post.id}`}><h3>{post.title}</h3></Link><p>{post.excerpt}</p><div className="blog-meta"><span>{post.date}</span><span><AccessTimeRounded/>{post.readTime}</span></div><Link className="blog-card-read-more" to={`/blog/${post.id}`} aria-label={`Read ${post.title}`}>Read article <ArrowForwardRounded/></Link></div></article>)}</div>
        {filtered.length === 0 && <div className="blog-empty"><h3>No stories found</h3><p>Try another category or search phrase.</p></div>}
      </section>
    </div>
  </main>;
}
