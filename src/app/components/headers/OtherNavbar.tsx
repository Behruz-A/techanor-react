import { useState } from "react";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import { CloseRounded, LoginRounded, Logout, MenuRounded, PersonAddAltRounded, ReceiptLongOutlined } from "@mui/icons-material";
import { Link, NavLink, useHistory } from "react-router-dom";
import Basket from "./Basket";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import BrandLogo from "../BrandLogo";
import NavbarSearch from "./NavbarSearch";
import Wishlist from "./Wishlist";
import { UserIcon } from "../icons/TechanorIcons";

interface OtherNavbarProps {
  setSignupOpen: (isOpen: boolean) => void;
  setLoginOpen: (isOpen: boolean) => void;
  handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  handleCloseLogout: () => void;
  handleLogoutRequest: () => void;
}

export default function OtherNavbar({
  setSignupOpen, setLoginOpen, handleLogoutClick, anchorEl,
  handleCloseLogout, handleLogoutRequest,
}: OtherNavbarProps) {
  const { authMember } = useGlobals();
  const history = useHistory();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const goTo = (path: string) => {
    handleCloseLogout();
    history.push(path);
  };

  return (
    <header className="other-navbar">
      <nav className="other-nav" aria-label="Main navigation">
        <Link className="other-brand" to="/" aria-label="Techanor home">
          <BrandLogo tone="dark" />
        </Link>
        <button className="other-menu-toggle" type="button" aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}>
          {mobileMenuOpen ? <CloseRounded /> : <MenuRounded />}
        </button>
        <div className={`other-nav-links${mobileMenuOpen ? " open" : ""}`}>
          <NavLink exact to="/" activeClassName="active" onClick={closeMobileMenu}>Home</NavLink>
          <NavLink to="/products" activeClassName="active" onClick={closeMobileMenu}>Shop</NavLink>
          <NavLink to="/blog" activeClassName="active" onClick={closeMobileMenu}>Blog</NavLink>
          <NavLink to="/help" activeClassName="active" onClick={closeMobileMenu}>Help</NavLink>
          {authMember && <NavLink to="/orders" activeClassName="active" onClick={closeMobileMenu}>Orders</NavLink>}
        </div>
        <div className="other-nav-actions">
          <NavbarSearch />
          <Wishlist />
          <div className="other-nav-basket"><Basket /></div>
          <button className={authMember ? "other-avatar-button" : "navbar-account-button"} type="button" aria-label="Open account menu" aria-haspopup="true" aria-expanded={Boolean(anchorEl)} onClick={handleLogoutClick}>
            {authMember ? <img src={authMember.memberImage ? `${serverApi}/${authMember.memberImage}` : "/icons/default-user.svg"} alt="Account" /> : <UserIcon />}
          </button>
        </div>
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
      </nav>
    </header>
  );
}
