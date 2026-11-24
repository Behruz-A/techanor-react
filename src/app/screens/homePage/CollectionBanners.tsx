import { Box, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { collectionBanners } from "../../../lib/data/collections";

export default function CollectionBanners() {
  return (
    <Box component="section" className="collection-banners" aria-label="Shop collections">
      <Box className="collection-banners__grid">
        {collectionBanners.map((banner) => (
          <Link
            className="collection-banner"
            to={`/products?${new URLSearchParams({ category: banner.category }).toString()}`}
            key={banner.category}
          >
            <img src={banner.image} alt="" loading="lazy" />
            <Stack className="collection-banner__copy">
              <h2>{banner.title}</h2>
              <span>Shop now <ChevronRightRoundedIcon /></span>
            </Stack>
          </Link>
        ))}
      </Box>
    </Box>
  );
}
