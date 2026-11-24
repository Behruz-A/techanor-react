import { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { A11y, Autoplay, Keyboard, Navigation, Pagination } from "swiper";
import { heroSlides } from "../../../lib/data/hero";
import "swiper/css";
import "../../../css/hero.css";

SwiperCore.use([A11y, Autoplay, Keyboard, Navigation, Pagination]);

export default function HomeHero() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  return (
    <Box component="section" className="home-campaign" aria-label="Featured collections">
      <Swiper
        id="home-campaign-slides"
        className="home-campaign__slider"
        slidesPerView={1}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: false }}
        speed={reduceMotion ? 0 : 450}
        keyboard={{ enabled: true, onlyInViewport: true }}
        navigation={{ prevEl: ".home-campaign__prev", nextEl: ".home-campaign__next" }}
        pagination={{ el: ".home-campaign__pagination", clickable: true }}
        a11y={{
          prevSlideMessage: "Previous collection",
          nextSlideMessage: "Next collection",
          paginationBulletMessage: "Go to collection {{index}}",
        }}
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            {({ isActive }) => (
              <Box className={`home-campaign__slide home-campaign__slide--${slide.id}`} aria-hidden={!isActive}>
                <picture className="home-campaign__image">
                  {slide.mobileImage && <source media="(max-width: 640px)" srcSet={slide.mobileImage} />}
                  <img src={slide.image} alt={slide.imageAlt} loading={index === 0 ? "eager" : "lazy"} />
                </picture>
                <div className="home-campaign__container">
                  <Stack className="home-campaign__copy">
                    <h1>{slide.title[0]}<br />{slide.title[1]}</h1>
                    <p>{slide.description}</p>
                    <Link
                      className="home-campaign__shop"
                      to={`/products?${new URLSearchParams({ category: slide.category }).toString()}`}
                      tabIndex={isActive ? 0 : -1}
                    >
                      Shop now <ChevronRightRoundedIcon />
                    </Link>
                  </Stack>
                </div>
              </Box>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="home-campaign__arrow home-campaign__prev" type="button" aria-label="Previous collection" aria-controls="home-campaign-slides"><ChevronLeftRoundedIcon /></button>
      <button className="home-campaign__arrow home-campaign__next" type="button" aria-label="Next collection" aria-controls="home-campaign-slides"><ChevronRightRoundedIcon /></button>
      <Box className="home-campaign__pagination" />
    </Box>
  );
}
