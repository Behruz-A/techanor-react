import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import { LoginRounded, Logout, PersonAddAltRounded, ReceiptLongOutlined } from "@mui/icons-material";
import { Link, NavLink, useHistory } from "react-router-dom";

import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import Basket from "./Basket";
import BrandLogo from "../BrandLogo";
import NavbarSearch from "./NavbarSearch";
import Wishlist from "./Wishlist";
import { UserIcon } from "../icons/TechanorIcons";

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
  const history = useHistory();

  const goTo = (path: string) => {
    handleCloseLogout();
    history.push(path);
  };

  return (
    <header className="home-navbar">
      <nav className="home-nav" aria-label="Main navigation">
        <div className="home-nav-left">
          <Link className="home-brand" to="/" aria-label="Techanor home">
            <BrandLogo />
          </Link>
          <NavbarSearch />
        </div>

        <div className="home-nav-links">
          <NavLink exact to="/" activeClassName="active">Home</NavLink>
          <NavLink to="/products" activeClassName="active">Products</NavLink>
          <NavLink to="/blog" activeClassName="active">Blog</NavLink>
          <NavLink to="/help" activeClassName="active">Help</NavLink>
        </div>

        <div className="home-nav-actions">
          <Wishlist />
          <div className="home-nav-basket">
            <Basket />
          </div>
          <button className={authMember ? "home-avatar-button" : "navbar-account-button"} type="button" aria-label="Open account menu" aria-haspopup="true" aria-expanded={Boolean(anchorEl)} onClick={handleLogoutClick}>
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
