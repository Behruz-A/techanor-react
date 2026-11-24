import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { A11y, Autoplay, Keyboard, Navigation, Pagination } from "swiper";
import { showcaseSlides } from "../../../lib/data/showcase";
import { replaceBrokenImage } from "../../../lib/utils/media";
import "swiper/css";
import "../../../css/productShowcase.css";

SwiperCore.use([A11y, Autoplay, Keyboard, Navigation, Pagination]);

export default function ProductShowcase() {
  return (
    <Box component="section" className="product-showcase" aria-label="Featured collections">
      <Swiper
        id="product-showcase-slides"
        slidesPerView={1}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: false }}
        watchOverflow
        speed={0}
        keyboard={{ enabled: true, onlyInViewport: true }}
        navigation={{ prevEl: ".product-showcase__prev", nextEl: ".product-showcase__next" }}
        pagination={{ el: ".product-showcase__pagination", clickable: true }}
        a11y={{ prevSlideMessage: "Previous collection", nextSlideMessage: "Next collection", paginationBulletMessage: "Go to collection {{index}}" }}
      >
        {showcaseSlides.map((slide) => <SwiperSlide key={slide.id}>
          {({ isActive }) => <article className="product-showcase__slide" aria-hidden={!isActive}>
            <div className="product-showcase__image">
              <img src={slide.image} alt={slide.imageAlt} loading="lazy" width={1225} height={500} onError={replaceBrokenImage} />
            </div>
            <div className="product-showcase__container">
              <div className="product-showcase__copy">
                <h2><Link to={slide.href} tabIndex={isActive ? 0 : -1}>{slide.title}</Link></h2>
                <p className="product-showcase__subtitle">{slide.subtitle}</p>
                <Link className="product-showcase__link" to={slide.href} tabIndex={isActive ? 0 : -1}>Explore collection <ChevronRightRoundedIcon /></Link>
              </div>
            </div>
          </article>}
        </SwiperSlide>)}
      </Swiper>
      <button className="product-showcase__arrow product-showcase__prev" type="button" aria-label="Previous collection" aria-controls="product-showcase-slides"><ChevronLeftRoundedIcon /></button>
      <button className="product-showcase__arrow product-showcase__next" type="button" aria-label="Next collection" aria-controls="product-showcase-slides"><ChevronRightRoundedIcon /></button>
      <div className="product-showcase__pagination" />
    </Box>
  );
}
