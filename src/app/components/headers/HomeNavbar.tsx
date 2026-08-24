import { useEffect, useState } from "react";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { Link, NavLink } from "react-router-dom";

import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";

interface HomeNavbarProps {
  setSignupOpen: (isOpen: boolean) => void;
  setLoginOpen: (isOpen: boolean) => void;
  handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  handleCloseLogout: () => void;
  handleLogoutRequest: () => void;
}

const slides = [
  {
    image: "/img/mackboooook.jpg",
    eyebrow: "MacBook Air",
    title: "Lightness meets power.",
    description: "A remarkably thin design. All-day performance. Ready wherever inspiration takes you.",
    action: "Explore MacBook",
    theme: "macbook",
  },
  {
    image: "/img/iphonebanner.jpg",
    eyebrow: "iPhone 17 Series",
    title: "Hello, future.",
    description: "A brilliant display, powerful cameras and effortless performance — beautifully designed for every day.",
    action: "Explore iPhone",
    theme: "iphone",
  },
  {
    image: "/img/samsunggalaxy.jpg",
    eyebrow: "Galaxy Z Series",
    title: "Unfold what’s next.",
    description: "A bigger canvas, intelligent features and an iconic foldable design. One device, endless possibilities.",
    action: "Explore Galaxy",
    theme: "galaxy",
  },
];

export default function HomeNavbar({
  setSignupOpen,
  setLoginOpen,
  handleLogoutClick,
  anchorEl,
  handleCloseLogout,
  handleLogoutRequest,
}: HomeNavbarProps) {
  const { authMember } = useGlobals();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = window.setInterval(
      () => setActiveSlide((current) => (current + 1) % slides.length),
      6000
    );
    return () => window.clearInterval(interval);
  }, [isPlaying]);

  const changeSlide = (direction: number) => {
    setActiveSlide(
      (current) => (current + direction + slides.length) % slides.length
    );
  };

  const slide = slides[activeSlide];

  return (
    <header className="home-navbar">
      <nav className="home-nav" aria-label="Main navigation">
        <Link className="home-brand" to="/" aria-label="Techanor home">
          Techanor
        </Link>

        <div className="home-nav-links">
          <NavLink exact to="/" activeClassName="active">Home</NavLink>
          <NavLink to="/products" activeClassName="active">Products</NavLink>
          <a href="#blog">Blog</a>
          <a href="#about-us">About Us</a>
        </div>

        <div className="home-nav-actions">
          {!authMember ? (
            <>
              <button className="home-login-button" type="button" onClick={() => setLoginOpen(true)}>Log in</button>
              <button className="home-signup-button" type="button" onClick={() => setSignupOpen(true)}>Sign Up</button>
            </>
          ) : (
            <button className="home-avatar-button" type="button" aria-label="Open account menu" aria-haspopup="true" onClick={handleLogoutClick}>
              <img src={authMember.memberImage ? `${serverApi}/${authMember.memberImage}` : "/icons/default-user.svg"} alt="Account" />
            </button>
          )}
        </div>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseLogout} onClick={handleCloseLogout} transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
          <MenuItem onClick={handleLogoutRequest}>
            <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </nav>

      <section className="home-hero" aria-roledescription="carousel">
        <div className="home-slide-content" aria-live="polite">
          <div className="home-slide-copy" key={`copy-${activeSlide}`}>
            <span className="home-slide-eyebrow">{slide.eyebrow}</span>
            <h1>{slide.title}</h1>
            <p>{slide.description}</p>
            <Link className="home-slide-cta" to="/products">
              {slide.action}<span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="home-slider-controls">
            <button className="home-slider-arrow" type="button" onClick={() => changeSlide(-1)} aria-label="Previous slide">&larr;</button>
            <span className="home-slide-count">{String(activeSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
            <div className="home-slider-progress" aria-hidden="true">
              <span style={{ width: `${((activeSlide + 1) / slides.length) * 100}%` }} />
            </div>
            <button className="home-slider-arrow" type="button" onClick={() => changeSlide(1)} aria-label="Next slide">&rarr;</button>
            <button className="home-play-button" type="button" onClick={() => setIsPlaying((playing) => !playing)} aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}>
              <span aria-hidden="true">{isPlaying ? "II" : ">"}</span>
            </button>
          </div>
        </div>

        <div className={`home-slide-image-wrap ${slide.theme}`}>
          <img key={slide.image} className="home-slide-image" src={slide.image} alt={slide.title} />
        </div>
      </section>
    </header>
  );
}
