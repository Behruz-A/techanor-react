import { useState } from "react";
import { Box, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { ProductCondition, PRODUCT_CATEGORY_LABELS } from "../../../constants/enums";
import { Product } from "../../../lib/types/product";
import { replaceBrokenImage, resolveMediaUrl } from "../../../lib/utils/media";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import ShoppingCartIcon from "../../components/icons/ShoppingCartIcon";

export default function FeaturedProductCard({ product }: { product: Product }) {
  const { wishlist, basket: { cartItems, onAdd } } = useGlobals();
  const [imageIndex, setImageIndex] = useState(0);
  const isFavorite = wishlist.has(product._id);
  const productUrl = `/products/${product._id}`;
  const quantityInCart = cartItems.find((item) => item._id === product._id)?.quantity || 0;
  const outOfStock = product.productLeftCount <= 0;
  const atStockLimit = quantityInCart >= product.productLeftCount;

  const changeImage = (direction: -1 | 1) => {
    setImageIndex((current) => (current + direction + product.productImages.length) % product.productImages.length);
  };

  const handleAddToCart = () => {
    if (outOfStock || atStockLimit) return;
    try {
      onAdd({
        _id: product._id,
        quantity: 1,
        maxQuantity: product.productLeftCount,
        name: product.productName,
        price: product.productPrice,
        image: product.productImages[0] || "",
      });
      void sweetTopSmallSuccessAlert("Added to your cart.");
    } catch (err) {
      void sweetErrorHandling(err);
    }
  };

  return (
    <Stack component="article" className="featured-product">
      <Box className="featured-product__header">
        <span>{product.productCategory ? PRODUCT_CATEGORY_LABELS[product.productCategory] : "Products"}</span>
        <button
          type="button"
          className={isFavorite ? "is-active" : ""}
          aria-label={`${isFavorite ? "Remove" : "Add"} ${product.productName} ${isFavorite ? "from" : "to"} wishlist`}
          aria-pressed={isFavorite}
          onClick={() => wishlist.toggle(product)}
        >
          {isFavorite ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
        </button>
      </Box>
      <Box className="featured-product__body">
        <Box className="featured-product__gallery">
          <Link className="featured-product__image" to={productUrl} aria-label={`View ${product.productName}`}>
            <img src={resolveMediaUrl(product.productImages[imageIndex], "/img/noimage-list.svg")} alt={product.productName} loading="lazy" onError={replaceBrokenImage} />
          </Link>
          {product.productImages.length > 1 && <>
            <button className="featured-product__image-prev" type="button" aria-label={`Previous image of ${product.productName}`} onClick={() => changeImage(-1)}><ChevronLeftRoundedIcon /></button>
            <button className="featured-product__image-next" type="button" aria-label={`Next image of ${product.productName}`} onClick={() => changeImage(1)}><ChevronRightRoundedIcon /></button>
          </>}
        </Box>
        <div className="featured-product__details">
          <div className="featured-product__badges">{product.productCondition === ProductCondition.NEW && <span>New</span>}</div>
          <h3><Link to={productUrl}>{product.productName}</Link></h3>
          <strong>${product.productPrice.toLocaleString("en-US")}</strong>
        </div>
      </Box>
      <button
        className="featured-product__add"
        type="button"
        disabled={outOfStock || atStockLimit}
        onClick={handleAddToCart}
        aria-label={outOfStock ? `${product.productName} is out of stock` : `Add ${product.productName} to cart`}
      >
        <span>{outOfStock ? "Out of stock" : atStockLimit ? "Maximum in cart" : "Add to cart"}</span>
        <ShoppingCartIcon />
      </button>
    </Stack>
  );
}
