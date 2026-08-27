import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { Link, NavLink } from "react-router-dom";

import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import Basket from "./Basket";
import BrandLogo from "../BrandLogo";

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
  const { authMember } = useGlobals();

  return (
    <header className="home-navbar">
      <nav className="home-nav" aria-label="Main navigation">
        <Link className="home-brand" to="/" aria-label="Techanor home">
          <BrandLogo />
        </Link>

        <div className="home-nav-links">
          <NavLink exact to="/" activeClassName="active">Home</NavLink>
          <NavLink to="/products" activeClassName="active">Products</NavLink>
          <NavLink to="/blog" activeClassName="active">Blog</NavLink>
          {authMember && <NavLink to="/member-page" activeClassName="active">My Page</NavLink>}
          {authMember && <NavLink to="/orders" activeClassName="active">Orders</NavLink>}
        </div>

        <div className="home-nav-actions">
          <div className="home-nav-basket">
            <Basket />
          </div>
          {!authMember ? (
            <>
              <button className="home-login-button" type="button" onClick={() => setLoginOpen(true)}>Log in</button>
              <button className="home-signup-button" type="button" onClick={() => setSignupOpen(true)}>Sign Up</button>
            </>
          ) : (
            <button className="home-avatar-button" type="button" aria-label="Open account menu" aria-haspopup="true" onClick={handleLogoutClick}>
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

      <section className="home-hero home-banner-hero" aria-label="Featured Techanor collection">
        <div className="home-slide-image-wrap" aria-hidden="true">
          <img className="home-banner-image" src="/img/home-iphone17-lifestyle.png" alt="" />
        </div>
        <div className="home-slide-content">
          <div className="home-hero-center">
            <span className="home-hero-eyebrow">The new iPhone 17 Pro</span>
            <h1>Pro power.<br />Boldly yours.</h1>
            <p>Performance and design in perfect balance.</p>

            <div className="home-hero-actions" aria-label="Explore Techanor">
              <Link className="home-slide-cta" to="/products">Shop collection</Link>
            </div>
          </div>
        </div>
      </section>
    </header>
  );
}
