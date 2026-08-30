import { FormEvent, useEffect, useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useHistory, useLocation } from "react-router-dom";

export default function NavbarSearch() {
  const history = useHistory();
  const location = useLocation();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const search = new URLSearchParams(location.search).get("search") || "";
    setQuery(location.pathname === "/products" ? search : "");
  }, [location.pathname, location.search]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedQuery = query.trim();
    history.push(normalizedQuery ? `/products?search=${encodeURIComponent(normalizedQuery)}` : "/products");
  };

  return (
    <form className="navbar-search" role="search" onSubmit={submitSearch}>
      <SearchRoundedIcon aria-hidden="true" />
      <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" aria-label="Search products" />
    </form>
  );
}
