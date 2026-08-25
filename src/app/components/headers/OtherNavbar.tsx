import { useState } from "react";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import { CloseRounded, Logout, MenuRounded } from "@mui/icons-material";
import { Link, NavLink } from "react-router-dom";
import Basket from "./Basket";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="other-navbar">
      <nav className="other-nav" aria-label="Main navigation">
        <Link className="other-brand" to="/" aria-label="Techanor home">
          <span className="other-brand-copy"><strong>TECHANOR</strong></span>
        </Link>
        <button className="other-menu-toggle" type="button" aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}>
          {mobileMenuOpen ? <CloseRounded /> : <MenuRounded />}
        </button>
        <div className={`other-nav-links${mobileMenuOpen ? " open" : ""}`}>
          <NavLink exact to="/" activeClassName="active" onClick={closeMobileMenu}>Home</NavLink>
          <NavLink to="/products" activeClassName="active" onClick={closeMobileMenu}>Products</NavLink>
          <NavLink to="/blog" activeClassName="active" onClick={closeMobileMenu}>Blog</NavLink>
          {authMember && <NavLink to="/member-page" activeClassName="active" onClick={closeMobileMenu}>My Page</NavLink>}
          {authMember && <NavLink to="/orders" activeClassName="active" onClick={closeMobileMenu}>Orders</NavLink>}
        </div>
        <div className="other-nav-actions">
          {authMember && <div className="other-nav-basket"><Basket /></div>}
          {!authMember ? (
            <>
              <button className="other-login-button" type="button" onClick={() => setLoginOpen(true)}>Log in</button>
              <button className="other-signup-button" type="button" onClick={() => setSignupOpen(true)}>Sign Up</button>
            </>
          ) : (
            <button className="other-avatar-button" type="button" aria-label="Open account menu" onClick={handleLogoutClick}>
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
    </header>
  );
}
