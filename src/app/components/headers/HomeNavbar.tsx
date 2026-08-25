import { useEffect, useState } from "react";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { Link, NavLink } from "react-router-dom";

import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import Basket from "./Basket";

const SLIDE_DURATION_MS = 11000;

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
    image: "/img/image2.jpg",
    eyebrow: "Performance",
    title: "Built to play. Ready to create.",
    description: "Powerful devices for gaming, work and everything in between.",
    position: "center center",
  },
  {
    image: "/img/image1.jpg",
    eyebrow: "Computing",
    title: "Your next idea starts here.",
    description: "Laptops selected for focus, speed and effortless everyday work.",
    position: "center center",
  },
  {
    image: "/img/slaydjon4.png",
    eyebrow: "Techanor selection",
    title: "Technology, thoughtfully selected.",
    description: "Discover standout devices from the brands you trust.",
    position: "center center",
  },
  {
    image: "/img/slaydjon20.png",
    eyebrow: "Entertainment",
    title: "Bring every detail to life.",
    description: "Vivid displays and cinematic sound made for moments that matter.",
    position: "center center",
  },
  {
    image: "/img/slaydjon3.png",
    eyebrow: "Mobile technology",
    title: "Stay connected to what matters.",
    description: "Smartphones and accessories designed around your everyday life.",
    position: "center center",
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
    slides.forEach(({ image }) => {
      const preloadImage = new Image();
      preloadImage.src = image;
    });
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = window.setInterval(
      () => setActiveSlide((current) => (current + 1) % slides.length),
      SLIDE_DURATION_MS
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
          TECHANOR
        </Link>

        <div className="home-nav-links">
          <NavLink exact to="/" activeClassName="active">Home</NavLink>
          <NavLink to="/products" activeClassName="active">Products</NavLink>
          <NavLink to="/blog" activeClassName="active">Blog</NavLink>
        </div>

        <div className="home-nav-actions">
          <div className="home-nav-basket">
            <Basket />
          </div>
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
        <div className="home-slide-content">
          <div className="home-hero-center" key={`hero-${activeSlide}`} aria-live="polite">
            <span className="home-hero-eyebrow">{slide.eyebrow}</span>
            <h1>{slide.title}</h1>
            <p>{slide.description}</p>

            <div className="home-hero-actions" aria-label="Explore Techanor">
              <Link className="home-slide-cta" to="/products">
                Shop products <span aria-hidden="true">&rarr;</span>
              </Link>
              <a className="home-slide-secondary" href="#shop-categories">
                Browse categories
              </a>
            </div>

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

        <div className="home-slide-image-wrap">
          {slides.map((item, index) => (
            <img
              key={item.image}
              className={`home-slide-image${index === activeSlide ? " active" : ""}`}
              src={item.image}
              alt=""
              aria-hidden={index !== activeSlide}
              style={{ objectPosition: item.position }}
            />
          ))}
        </div>
      </section>

      <div className="home-trust-strip" aria-label="Shopping benefits">
        <div className="home-trust-strip__inner">
          <span><b aria-hidden="true">✓</b><span><strong>Official warranty</strong><small>Trusted brand coverage</small></span></span>
          <span><b aria-hidden="true">◇</b><span><strong>Secure checkout</strong><small>Protected payments</small></span></span>
          <span><b aria-hidden="true">↻</b><span><strong>Easy returns</strong><small>Simple return process</small></span></span>
          <span><b aria-hidden="true">24/7</b><span><strong>Customer support</strong><small>Here when you need us</small></span></span>
        </div>
      </div>
    </header>
  );
}
