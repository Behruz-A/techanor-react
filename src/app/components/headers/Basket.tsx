import React from "react";
import { Box, Button, Drawer } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import CloseRounded from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { Messages, serverApi } from "../../../lib/config";
import { useGlobals } from "../../hooks/useGlobals";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { isMongoObjectId } from "../../../lib/utils/objectId";
import ShoppingCartIcon from "../icons/ShoppingCartIcon";
import { TrashIcon } from "../icons/TechanorIcons";

interface BasketProps {}

const FREE_SHIPPING_THRESHOLD = 79;
const STANDARD_SHIPPING_COST = 5;

export default function Basket(props: BasketProps) {
  const {
    authMember,
    basket: { cartItems, itemCount, subtotal, onAdd, onRemove, onDelete, onDeleteAll },
  } = useGlobals();
  const history = useHistory();
  const shippingCost: number = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const totalPrice = subtotal + shippingCost;

  const [open, setOpen] = React.useState(false);
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);

  /** HANDLERS **/

  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const continueShopping = () => {
    handleClose();
    history.push("/products");
  };

  const ProceedOrderHandler = async () => {
    if (isCheckingOut || cartItems.length === 0) return;

    try {
      if (!authMember) throw new Error(Messages.error2);
      const purchasableItems = cartItems.filter((item) => isMongoObjectId(item._id));
      if (purchasableItems.length === 0) {
        onDeleteAll();
        throw new Error("Promotional preview items cannot be ordered. They were removed from your basket; please add a product from the catalog.");
      }

      setIsCheckingOut(true);
      handleClose();
      history.push("/checkout");
    } catch (err) {
      sweetErrorHandling(err).then();
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Box className={"hover-line"}>
      <IconButton
        aria-label="cart"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Badge badgeContent={itemCount} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        className="basket-drawer"
        PaperProps={{ className: "basket-drawer-paper" }}
      >
        <Box className="basket-drawer-shell" role="dialog" aria-label="Shopping bag">
          <header className="basket-drawer-header">
            <div><span>YOUR SELECTION</span><h2>Shopping bag <small>{itemCount}</small></h2></div>
            <IconButton onClick={handleClose} aria-label="Close shopping bag"><CloseRounded /></IconButton>
          </header>

          {cartItems.length === 0 ? <div className="basket-drawer-empty"><ShoppingCartIcon /><h3>Your bag is empty</h3><p>Explore our collection and add something you love.</p><button type="button" onClick={continueShopping}>Explore products</button></div> : <>
            <div className="basket-drawer-tools"><span>{itemCount} {itemCount === 1 ? "item" : "items"} in your bag</span><button type="button" onClick={onDeleteAll}><TrashIcon />Clear all</button></div>
            <div className="basket-drawer-items">
              {cartItems.map((item: CartItem) => {
                const imagePath = item.image.startsWith("/") || item.image.startsWith("http") ? item.image : `${serverApi}/${item.image}`;
                return (
                  <article className="basket-drawer-item" key={item._id}>
                    <div className="basket-drawer-media"><img src={imagePath} alt={item.name} /></div>
                    <div className="basket-drawer-item-copy">
                      <h3>{item.name}</h3>
                      <p>${item.price.toLocaleString()} each</p>
                      <small className={item.quantity >= item.maxQuantity ? "basket-stock-limit reached" : "basket-stock-limit"}>{item.quantity >= item.maxQuantity ? "Maximum stock reached" : `${item.maxQuantity} available`}</small>
                      <div className="basket-quantity">
                        <button type="button" onClick={() => onRemove(item)} aria-label={`Decrease ${item.name} quantity`}><RemoveRoundedIcon /></button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => onAdd({ ...item, quantity: 1 })} disabled={item.quantity >= item.maxQuantity} aria-label={`Increase ${item.name} quantity`}><AddRoundedIcon /></button>
                      </div>
                    </div>
                    <div className="basket-drawer-item-actions">
                      <button type="button" onClick={() => onDelete(item)} aria-label={`Remove ${item.name}`}><TrashIcon /></button>
                      <strong>${(item.price * item.quantity).toLocaleString()}</strong>
                    </div>
                  </article>
                );
              })}
            </div>
            <footer className="basket-drawer-footer">
              <div className="basket-summary-row"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
              <div className="basket-summary-row"><span>Delivery</span><strong>{shippingCost ? `$${shippingCost.toFixed(2)}` : "Free"}</strong></div>
              <div className="basket-summary-total"><span>Total</span><strong>${totalPrice.toFixed(2)}</strong></div>
              <Button type="button" onClick={ProceedOrderHandler} variant="contained" disabled={isCheckingOut || cartItems.length === 0}>{isCheckingOut ? "Creating order..." : "Checkout"}</Button>
              <button type="button" onClick={continueShopping}>Continue shopping</button>
            </footer>
          </>}
        </Box>
      </Drawer>
    </Box>
  );
}
