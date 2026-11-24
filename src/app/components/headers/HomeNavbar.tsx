import { Box, ListItemIcon, Menu, MenuItem, Stack } from "@mui/material";
import { LoginRounded, Logout, PersonAddAltRounded, ReceiptLongOutlined } from "@mui/icons-material";
import { Link, NavLink, useHistory } from "react-router-dom";

import { useGlobals } from "../../hooks/useGlobals";
import { replaceBrokenImage, resolveMediaUrl } from "../../../lib/utils/media";
import Basket from "./Basket";
import BrandLogo from "../BrandLogo";
import NavbarSearch from "./NavbarSearch";
import HomeHero from "./HomeHero";
import Wishlist from "./Wishlist";
import { UserIcon } from "../icons/TechanorIcons";
import "../../../css/homeNavbar.css";

interface HomeNavbarProps {
  setSignupOpen: (isOpen: boolean) => void;
  setLoginOpen: (isOpen: boolean) => void;
  handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  handleCloseLogout: () => void;
  handleLogoutRequest: () => void;
}

export default function HomeNavbar({
  setSignupOpen,
  setLoginOpen,
  handleLogoutClick,
  anchorEl,
  handleCloseLogout,
  handleLogoutRequest,
}: HomeNavbarProps) {
  const { authMember, basket: { cartItems } } = useGlobals();
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const history = useHistory();

  const goTo = (path: string) => {
    handleCloseLogout();
    history.push(path);
  };

  return (
    <header className="store-header">
      <Box className="store-header__utility">
        <div className="store-header__container store-header__utility-inner">
          <span>Welcome to Techanor store</span>
          <Link to="/help?tab=contact">Help &amp; Contact</Link>
        </div>
      </Box>
      <div className="store-header__container store-header__main">
        <Link className="store-header__brand" to="/" aria-label="Techanor home">
          <BrandLogo tone="dark" />
        </Link>
        <NavbarSearch variant="inline" />
        <Stack className="store-header__actions">
          <button
            className="store-header__account"
            type="button"
            aria-label="Open account menu"
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl)}
            onClick={handleLogoutClick}
          >
            {authMember ? <img src={resolveMediaUrl(authMember.memberImage, "/icons/default-user.svg")} alt="Account" onError={(event) => replaceBrokenImage(event, "/icons/default-user.svg")} /> : <UserIcon />}
          </button>
          <Wishlist />
          <div className="store-header__basket">
            <Basket />
            <span aria-label={`Cart subtotal: ${subtotal.toFixed(2)} dollars`}>${subtotal.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
          </div>
        </Stack>
        <Menu className="account-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseLogout} transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
          {!authMember ? [
            <MenuItem key="login" onClick={() => { handleCloseLogout(); setLoginOpen(true); }}><ListItemIcon><LoginRounded fontSize="small" /></ListItemIcon>Log in</MenuItem>,
            <MenuItem className="account-menu-primary" key="signup" onClick={() => { handleCloseLogout(); setSignupOpen(true); }}><ListItemIcon><PersonAddAltRounded fontSize="small" /></ListItemIcon>Create account</MenuItem>,
          ] : [
            <MenuItem key="profile" onClick={() => goTo("/member-page")}><ListItemIcon><UserIcon /></ListItemIcon>My profile</MenuItem>,
            <MenuItem key="orders" onClick={() => goTo("/orders")}><ListItemIcon><ReceiptLongOutlined fontSize="small" /></ListItemIcon>My orders</MenuItem>,
            <MenuItem key="logout" onClick={() => { handleCloseLogout(); handleLogoutRequest(); }}><ListItemIcon><Logout fontSize="small" /></ListItemIcon>Logout</MenuItem>,
          ]}
        </Menu>
      </div>
      <Box className="store-header__navigation">
        <Stack component="nav" className="store-header__container store-header__links" aria-label="Main navigation">
          <NavLink exact to="/" activeClassName="active">Home</NavLink>
          <NavLink to="/products" activeClassName="active">Shop</NavLink>
          <NavLink to="/blog" activeClassName="active">Blog</NavLink>
          <NavLink to="/about" activeClassName="active">About Us</NavLink>
          <NavLink to="/help" activeClassName="active">Help</NavLink>
        </Stack>
      </Box>
      <HomeHero />
    </header>
  );
}
