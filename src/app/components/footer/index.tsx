import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { Link } from "react-router-dom";
import BrandLogo from "../BrandLogo";

const shopLinks = [
  "Computers & Laptops",
  "Smartphones",
  "Headphones",
  "Accessories",
  "Cameras & Photo",
  "TV & Home",
];

const serviceLinks = [
  { label: "Help Center", to: "/help" },
  { label: "Shipping & Delivery", to: "/help" },
  { label: "Returns & Refunds", to: "/help" },
  { label: "Order Tracking", to: "/orders" },
  { label: "Payment Methods", to: "/help" },
  { label: "Contact Us", to: "/contact" },
];

const aboutLinks = [
  { label: "Blog", to: "/blog" },
  { label: "Contact Us", to: "/contact" },
];

const brands = ["Apple", "Samsung", "Sony", "LG", "Lenovo", "Dell"];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-back-to-top">
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Back to top <span aria-hidden="true">&uarr;</span>
        </button>
      </div>

      <div className="footer-container">
        <div className="footer-grid">
          <section className="footer-brand-column">
            <Link className="footer-brand" to="/" aria-label="Techanor home">
              <BrandLogo tone="dark" />
            </Link>
            <p className="footer-description">
              Smart technology, carefully selected. Discover devices and accessories built for work, creativity and everyday life.
            </p>
            <address className="footer-contact">
              <a href="tel:+820100101010"><PhoneOutlinedIcon />+82 010-0101-010</a>
              <a href="mailto:support@techanor.com"><EmailOutlinedIcon />support@techanor.com</a>
              <span><LocationOnOutlinedIcon />Seoul, South Korea</span>
            </address>
            <div className="footer-socials" aria-label="Social media">
              <a href="#instagram" aria-label="Instagram"><span className="footer-social-icon footer-social-instagram" aria-hidden="true" /></a>
              <a href="#telegram" aria-label="Telegram"><span className="footer-social-icon footer-social-telegram" aria-hidden="true" /></a>
              <a href="#youtube" aria-label="YouTube"><span className="footer-social-icon footer-social-youtube" aria-hidden="true" /></a>
            </div>
          </section>

          <section>
            <h2 className="footer-title">Shop</h2>
            <nav className="footer-links" aria-label="Shop categories">
              {shopLinks.map((label) => <Link key={label} to="/products">{label}</Link>)}
            </nav>
            <Link className="footer-accent-link" to="/products">Browse all products <span aria-hidden="true">&rarr;</span></Link>
          </section>

          <section>
            <h2 className="footer-title">Customer Service</h2>
            <nav className="footer-links" aria-label="Customer service">
              {serviceLinks.map(({ label, to }) => <Link key={label} to={to}>{label}</Link>)}
            </nav>
          </section>

          <section>
            <h2 className="footer-title">About Techanor</h2>
            <nav className="footer-links" aria-label="About Techanor">
              {aboutLinks.map(({ label, to }) => <Link key={label} to={to}>{label}</Link>)}
            </nav>
          </section>

          <section>
            <h2 className="footer-title">Brands</h2>
            <nav className="footer-links" aria-label="Product brands">
              {brands.map((brand) => <Link key={brand} to="/products">{brand}</Link>)}
            </nav>
            <Link className="footer-accent-link" to="/products">View all brands <span aria-hidden="true">&rarr;</span></Link>
          </section>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Techanor. All rights reserved.</span>
          <div><span>Privacy</span><i aria-hidden="true" /><span>Terms</span></div>
        </div>
      </div>
    </footer>
  );
}
