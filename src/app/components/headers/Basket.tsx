import React from "react";
import { Box, Button, Drawer } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import CloseRounded from "@mui/icons-material/CloseRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { Messages, serverApi } from "../../../lib/config";
import { useGlobals } from "../../hooks/useGlobals";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import OrderService from "../../services/OrderService";

interface BasketProps {}

export default function Basket(props: BasketProps) {
  const {
    authMember,
    setOrderBuilder,
    basket: { cartItems, onAdd, onRemove, onDelete, onDeleteAll },
  } = useGlobals();
  const history = useHistory();
  const itemsPrice: number = cartItems.reduce(
    (a: number, c: CartItem) => a + c.quantity * c.price,
    0,
  );

  const shippingCost: number = itemsPrice < 100 ? 5 : 0;
  const totalPrice = (itemsPrice + shippingCost).toFixed(1);

  const [open, setOpen] = React.useState(false);

  /** HANDLERS **/

  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const continueShopping = () => {
    handleClose();
    history.push("/products");
  };

  const ProceedOrderHandler = async () => {
    try {
      handleClose();
      if (!authMember) throw new Error(Messages.error2);

      const order = new OrderService();
      await order.createOrder(cartItems);

      onDeleteAll();

      setOrderBuilder(new Date());
      history.push("/orders");
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
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
        <Badge badgeContent={cartItems.length} color="secondary">
          <img src={"/icons/shopping-cart.svg"} alt="" />
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
            <div><span>YOUR SELECTION</span><h2>Shopping bag <small>{cartItems.length}</small></h2></div>
            <IconButton onClick={handleClose} aria-label="Close shopping bag"><CloseRounded /></IconButton>
          </header>

          {cartItems.length === 0 ? <div className="basket-drawer-empty"><ShoppingCartIcon/><h3>Your bag is empty</h3><p>Explore our collection and add something you love.</p><button type="button" onClick={continueShopping}>Explore products</button></div> : <>
            <div className="basket-drawer-tools"><span>{cartItems.length} {cartItems.length === 1 ? "item" : "items"}</span><button type="button" onClick={onDeleteAll}><DeleteOutlineRounded/>Clear bag</button></div>
            <div className="basket-drawer-items">
              {cartItems.map((item: CartItem) => {
                const imagePath = item.image.startsWith("/") ? item.image : `${serverApi}/${item.image}`;
                return (
                  <article className="basket-drawer-item" key={item._id}>
                    <div className="basket-drawer-media"><img src={imagePath} alt={item.name} /></div>
                    <div className="basket-drawer-item-copy"><h3>{item.name}</h3><p>${item.price.toLocaleString()}</p><div className="basket-quantity"><button type="button" onClick={() => onRemove(item)} aria-label={`Decrease ${item.name} quantity`}>−</button><span>{item.quantity}</span><button type="button" onClick={() => onAdd(item)} aria-label={`Increase ${item.name} quantity`}>+</button></div><button className="basket-remove" type="button" onClick={() => onDelete(item)}>Remove</button></div>
                    <strong>${(item.price * item.quantity).toLocaleString()}</strong>
                  </article>
                );
              })}
            </div>
            <footer className="basket-drawer-footer"><div><span>Subtotal</span><strong>${itemsPrice.toLocaleString()}</strong></div><p>{shippingCost ? `$${shippingCost.toFixed(2)} shipping will be added.` : "Complimentary shipping included."}</p><Button onClick={ProceedOrderHandler} variant="contained">Checkout · ${totalPrice}</Button><button type="button" onClick={continueShopping}>Continue shopping</button></footer>
          </>}
        </Box>
      </Drawer>
    </Box>
  );
}
