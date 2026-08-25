import { Link } from "react-router-dom";

const categories = [
  "Computers & Laptops",
  "Smartphones",
  "Headphones",
  "Accessories",
  "Cameras & Photo",
  "TV & Home",
];

const tags = [
  "Gaming",
  "iPhone",
  "MacBook",
  "Samsung",
  "SSD",
  "Graphics Card",
  "Smart TV",
  "Speaker",
  "Tablet",
  "Power Bank",
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top-row">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Back to top <span aria-hidden="true">↑</span>
          </button>
        </div>
        <div className="footer-grid">
          <section className="footer-brand-column">
            <Link className="footer-brand" to="/">TECHANOR</Link>
            <p className="footer-description">
              Smart technology, carefully selected. Discover devices and
              accessories built for work, creativity and everyday life.
            </p>
            <div className="footer-contact">
              <a href="tel:+820100101010">+82 010-0101-010</a>
              <a href="mailto:support@techanor.com">support@techanor.com</a>
              <span>Seoul, South Korea</span>
            </div>
            <div className="footer-socials" aria-label="Social media">
              <a href="#instagram" aria-label="Instagram">
                <span className="footer-social-icon footer-social-instagram" aria-hidden="true" />
              </a>
              <a href="#telegram" aria-label="Telegram">
                <span className="footer-social-icon footer-social-telegram" aria-hidden="true" />
              </a>
              <a href="#youtube" aria-label="YouTube">
                <span className="footer-social-icon footer-social-youtube" aria-hidden="true" />
              </a>
            </div>
          </section>

          <section>
            <h2 className="footer-title">Top categories</h2>
            <nav className="footer-links" aria-label="Product categories">
              {categories.map((category) => (
                <Link key={category} to="/products">{category}</Link>
              ))}
            </nav>
            <Link className="footer-accent-link" to="/products">
              Browse all products <span aria-hidden="true">&rarr;</span>
            </Link>
          </section>

          <section>
            <h2 className="footer-title">Quick links</h2>
            <nav className="footer-links" aria-label="Footer navigation">
              <Link to="/">Home</Link>
              <Link to="/products">Shop products</Link>
              <a href="/#blog">Blog</a>
              <a href="/#about-us">About us</a>
              <Link to="/help">Customer help</Link>
            </nav>
          </section>

          <section>
            <h2 className="footer-title">Download app</h2>
            <div className="footer-apps">
              <a href="#google-play" aria-label="Get Techanor on Google Play">
                <span className="footer-app-icon" aria-hidden="true">&#9654;</span>
                <span><small>GET IT ON</small>Google Play</span>
              </a>
              <a href="#app-store" aria-label="Download Techanor on the App Store">
                <span className="footer-app-icon" aria-hidden="true">&#9679;</span>
                <span><small>DOWNLOAD ON THE</small>App Store</span>
              </a>
            </div>
          </section>

          <section className="footer-tags-column">
            <h2 className="footer-title">Popular tags</h2>
            <div className="footer-tags">
              {tags.map((tag) => (
                <Link key={tag} to="/products">{tag}</Link>
              ))}
            </div>
          </section>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Techanor. All rights reserved.</span>
          <div>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
