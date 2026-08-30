import { useState } from "react";
import { Badge, Drawer, IconButton } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { useHistory } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { useGlobals } from "../../hooks/useGlobals";
import ShoppingCartIcon from "../icons/ShoppingCartIcon";
import { TrashIcon } from "../icons/TechanorIcons";

const imageUrl = (path?: string) => {
  if (!path) return "/icons/noimage-list.svg";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `${serverApi}/${path}`;
};

export default function Wishlist() {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const { basket: { onAdd }, wishlist: { items, remove, clear } } = useGlobals();

  const addToBasket = (product: typeof items[number]) => onAdd({
    _id: product._id,
    quantity: 1,
    maxQuantity: product.productLeftCount,
    name: product.productName,
    price: product.productPrice,
    image: product.productImages?.[0] || "",
  });

  const openProduct = (productId: string) => {
    setOpen(false);
    history.push(`/products/${productId}`);
  };

  return (
    <>
      <IconButton className="navbar-icon-button" aria-label={`Wishlist with ${items.length} items`} onClick={() => setOpen(true)}>
        <Badge badgeContent={items.length} color="secondary"><FavoriteBorderRoundedIcon /></Badge>
      </IconButton>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ className: "wishlist-drawer-paper" }}>
        <section className="wishlist-drawer" aria-label="Wishlist">
          <header>
            <div><span>SAVED PRODUCTS</span><h2>Wishlist <small>{items.length}</small></h2></div>
            <IconButton onClick={() => setOpen(false)} aria-label="Close wishlist"><CloseRoundedIcon /></IconButton>
          </header>
          {items.length === 0 ? (
            <div className="wishlist-empty">
              <FavoriteBorderRoundedIcon />
              <h3>Your wishlist is empty</h3>
              <p>Save products you like and find them here later.</p>
              <button type="button" onClick={() => { setOpen(false); history.push("/products"); }}>Explore products</button>
            </div>
          ) : (
            <>
              <div className="wishlist-tools"><span>{items.length} saved</span><button type="button" onClick={clear}>Clear all</button></div>
              <div className="wishlist-items">
                {items.map((product) => (
                  <article key={product._id}>
                    <button className="wishlist-product" type="button" onClick={() => openProduct(product._id)}>
                      <img src={imageUrl(product.productImages?.[0])} alt="" />
                      <span><strong>{product.productName}</strong><small>${product.productPrice.toLocaleString()}</small></span>
                    </button>
                    <button className="wishlist-add" type="button" onClick={() => addToBasket(product)} disabled={product.productLeftCount <= 0}>
                      <ShoppingCartIcon /> {product.productLeftCount > 0 ? "Add to cart" : "Out of stock"}
                    </button>
                    <button className="wishlist-remove" type="button" onClick={() => remove(product._id)} aria-label={`Remove ${product.productName}`}><TrashIcon /></button>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </Drawer>
    </>
  );
}
