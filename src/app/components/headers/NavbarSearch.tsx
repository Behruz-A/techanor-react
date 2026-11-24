import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useHistory, useLocation } from "react-router-dom";

export default function NavbarSearch() {
  const history = useHistory();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeSearch = useCallback((restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    const search = new URLSearchParams(location.search).get("search") || "";
    setQuery(location.pathname === "/products" ? search : "");
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!isOpen) return;

    const focusFrame = window.requestAnimationFrame(() => inputRef.current?.focus());
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSearch(true);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [closeSearch, isOpen]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedQuery = query.trim();
    history.push(normalizedQuery ? `/products?search=${encodeURIComponent(normalizedQuery)}` : "/products");
    setIsOpen(false);
  };

  return (
    <div className={`navbar-search-shell${isOpen ? " is-open" : ""}`}>
      <button
        ref={triggerRef}
        className="navbar-search-trigger"
        type="button"
        aria-label="Open search"
        aria-expanded={isOpen}
        aria-controls="navbar-search-panel"
        onClick={() => setIsOpen((open) => !open)}
      >
        <SearchRoundedIcon aria-hidden="true" />
      </button>

      <div id="navbar-search-panel" className="navbar-search-panel" aria-hidden={!isOpen}>
        <div className="navbar-search-panel-inner">
          <form className="navbar-search-form" role="search" onSubmit={submitSearch}>
            <SearchRoundedIcon className="navbar-search-field-icon" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, brands and more..."
              aria-label="Search products, brands and more"
            />
            <button className="navbar-search-submit" type="submit" aria-label="Search products">
              <SearchRoundedIcon aria-hidden="true" />
            </button>
          </form>
          <button className="navbar-search-close" type="button" aria-label="Close search" onClick={() => closeSearch(true)}>
            <CloseRoundedIcon aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
