import { FormEvent, useState } from "react";
import { Box, Stack } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Link } from "react-router-dom";
import { footerContact, footerSections } from "../../../lib/data/footer";
import BrandLogo from "../BrandLogo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [showNewsletterPreview, setShowNewsletterPreview] = useState(false);

  const handleNewsletterPreview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowNewsletterPreview(true);
  };

  return (
    <Box component="footer" className="site-footer">
      <div className="footer-container">
        <Box className="footer-newsletter">
          <h2>Sign up to Newsletter</h2>
          <div>
            <form className="footer-email-form" onSubmit={handleNewsletterPreview}>
              <input
                type="email"
                aria-label="Newsletter email address"
                placeholder="Your Email Address:"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => { setEmail(event.target.value); setShowNewsletterPreview(false); }}
              />
              <button type="submit" aria-label="Preview newsletter signup"><EmailOutlinedIcon /></button>
            </form>
            {showNewsletterPreview && <p className="footer-newsletter-note" role="status">This newsletter form is a preview. Your email has not been submitted.</p>}
          </div>
          <div className="footer-follow">
            <h3>Follow us on:</h3>
            <div className="footer-socials" role="img" aria-label="Instagram, Telegram and YouTube">
              <InstagramIcon /><TelegramIcon /><YouTubeIcon />
            </div>
          </div>
        </Box>

        <Box className="footer-grid">
          {footerSections.map((section) => <section key={section.title}>
            <h2 className="footer-title">{section.title}</h2>
            <Stack component="nav" className="footer-links" aria-label={section.title}>
              {section.links.map((link) => <Link key={link.label} to={link.to}>{link.label}</Link>)}
            </Stack>
          </section>)}
          <section>
            <h2 className="footer-title">Customer Care</h2>
            <Stack className="footer-links">
              <Link to="/member-page">My Account</Link>
              <Link to="/help?tab=contact">Customer Support</Link>
              <Link to="/help?tab=faq">Product FAQs</Link>
              <a href={`mailto:${footerContact.email}`}>{footerContact.email}</a>
              <a href={footerContact.phoneLink}>{footerContact.phone}</a>
              <span>{footerContact.location}</span>
            </Stack>
          </section>
        </Box>

        <Box className="footer-service-strip">
          <Link className="footer-brand" to="/" aria-label="Techanor home"><BrandLogo tone="light" /></Link>
          <a href={footerContact.phoneLink}><HeadsetMicOutlinedIcon /><span>{footerContact.phone}</span></a>
          <Link to="/help"><LocalShippingOutlinedIcon /><span>Shipping &amp; delivery</span></Link>
          <a href={`mailto:${footerContact.email}`}><EmailOutlinedIcon /><span>{footerContact.email}</span></a>
        </Box>
        <Box className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Techanor. All rights reserved.</span>
          <span className="footer-location"><LocationOnOutlinedIcon />{footerContact.location}</span>
        </Box>
      </div>
    </Box>
  );
}
