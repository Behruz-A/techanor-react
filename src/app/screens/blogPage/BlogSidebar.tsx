import { FormEvent, useState } from "react";
import { Box, Stack } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AssignmentReturnOutlinedIcon from "@mui/icons-material/AssignmentReturnOutlined";
import { BlogPostCategory, BLOG_CATEGORY_LABELS } from "../../../constants/enums";
import { BlogPost } from "../../../lib/types/blog";
import { formatBlogDate, getBlogMediaUrl } from "./blogUtils";

const categories = Object.values(BlogPostCategory);
const gallery = [
  { image: "/img/headphonenew.jpg", label: "Headphones" },
  { image: "/img/newmackbook.jpg", label: "Laptops" },
  { image: "/img/watchnew.png", label: "Watches" },
  { image: "/img/samsungphone.jpg", label: "Smartphones" },
  { image: "/img/controllergamigimg.png", label: "Gaming" },
  { image: "/img/cameraimg.jpg", label: "Cameras" },
];

export default function BlogSidebar({ relatedPosts }: { relatedPosts: BlogPost[] }) {
  const history = useHistory();
  const [search, setSearch] = useState("");
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    history.push(`/blog${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <Stack component="aside" className="journal-sidebar" aria-label="More from Techanor">
      <Box component="form" className="journal-search" onSubmit={handleSearch}>
        <input aria-label="Search blog posts" placeholder="Type your text" value={search} onChange={(event) => setSearch(event.target.value)} />
        <button type="submit" aria-label="Search"><SearchRoundedIcon /></button>
      </Box>
      <section>
        <h2>Categories</h2>
        <Stack component="nav" className="journal-categories" aria-label="Blog categories">
          {categories.map((category) => <Link key={category} to={`/blog?${new URLSearchParams({ category }).toString()}`}>{BLOG_CATEGORY_LABELS[category]}</Link>)}
        </Stack>
      </section>
      {relatedPosts.length > 0 && <section>
        <h2>Related Posts</h2>
        <Stack className="journal-related">
          {relatedPosts.map((post) => {
            const image = getBlogMediaUrl(post.blogPostImage);
            return <Link to={`/blog/${post._id}`} key={post._id}>
              {image ? <img src={image} alt="" loading="lazy" /> : <span className="journal-related__placeholder" />}
              <div><time dateTime={post.createdAt}>{formatBlogDate(post.createdAt)}</time><h3>{post.blogPostTitle}</h3></div>
            </Link>;
          })}
        </Stack>
      </section>}
      <section>
        <h2>Explore Topics</h2>
        <div className="journal-tags">{categories.map((category) => <Link key={category} to={`/blog?${new URLSearchParams({ category }).toString()}`}>{BLOG_CATEGORY_LABELS[category]}</Link>)}</div>
      </section>
      <section>
        <h2>Discover Techanor</h2>
        <div className="journal-gallery">{gallery.map((item) => <Link to="/products" key={item.label} aria-label={`Explore ${item.label.toLowerCase()}`}><img src={item.image} alt={item.label} loading="lazy" /></Link>)}</div>
      </section>
      <section>
        <h2>Stay in touch</h2>
        <p>Questions about a story or a product? Our team is here to help.</p>
        <Link className="journal-text-link" to="/help?tab=contact">Contact Techanor<ChevronRightRoundedIcon /></Link>
      </section>
      <Link className="journal-promotion" to="/products">
        <h2>Technology<br />for everyday life</h2>
        <span className="journal-text-link">Shop now<ChevronRightRoundedIcon /></span>
        <img src="/img/headphonenew.jpg" alt="Explore Techanor headphones" loading="lazy" />
      </Link>
      <Stack className="journal-services">
        <Link to="/help"><CreditCardOutlinedIcon /><div><span>Payment</span><strong>Payment methods</strong></div></Link>
        <a href="tel:+820100101010"><HeadsetMicOutlinedIcon /><div><span>Call center</span><strong>+82 010-0101-010</strong></div></a>
        <Link to="/help"><LocalShippingOutlinedIcon /><div><span>Delivery</span><strong>Shipping information</strong></div></Link>
        <Link to="/help"><AssignmentReturnOutlinedIcon /><div><span>Returns</span><strong>Returns &amp; refunds</strong></div></Link>
      </Stack>
    </Stack>
  );
}
