import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useHistory, useLocation } from "react-router-dom";

import { ProductCategory, PRODUCT_CATEGORY_LABELS } from "../../../constants/enums";

interface NavbarSearchProps {
  variant?: "popover" | "inline";
}

export default function NavbarSearch({ variant = "popover" }: NavbarSearchProps) {
  const history = useHistory();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCategory | "">("");
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
    const categoryValue = new URLSearchParams(location.search).get("category");
    setCategory(location.pathname === "/products" ? Object.values(ProductCategory).find((value) => value === categoryValue) || "" : "");
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
    const params = new URLSearchParams();
    if (normalizedQuery) params.set("search", normalizedQuery);
    if (variant === "inline" && category) params.set("category", category);
    history.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
    setIsOpen(false);
  };

  if (variant === "inline") {
    return (
      <form className="catalog-search" role="search" aria-label="Search catalog" onSubmit={submitSearch}>
        <select
          aria-label="Product category"
          value={category}
          onChange={(event) => setCategory(Object.values(ProductCategory).find((value) => value === event.target.value) || "")}
        >
          <option value="">All Categories</option>
          {Object.values(ProductCategory).map((value) => <option key={value} value={value}>{PRODUCT_CATEGORY_LABELS[value]}</option>)}
        </select>
        <input
          type="search"
          aria-label="Search products"
          placeholder="Search for Product..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit" aria-label="Search catalog"><SearchRoundedIcon /></button>
      </form>
    );
  }

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
