import { useState } from "react";
import { Product } from "../../lib/types/product";

const WISHLIST_STORAGE_KEY = "wishlistData";

const readStoredWishlist = (): Product[] => {
  try {
    const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    const parsedWishlist: unknown = storedWishlist ? JSON.parse(storedWishlist) : [];
    return Array.isArray(parsedWishlist) ? parsedWishlist as Product[] : [];
  } catch {
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
    return [];
  }
};

const useWishlist = () => {
  const [items, setItems] = useState<Product[]>(readStoredWishlist);

  const updateItems = (updater: (current: Product[]) => Product[]) => {
    setItems((current) => {
      const nextItems = updater(current);
      if (nextItems.length) localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(nextItems));
      else localStorage.removeItem(WISHLIST_STORAGE_KEY);
      return nextItems;
    });
  };

  const has = (productId: string) => items.some((item) => item._id === productId);
  const toggle = (product: Product) => updateItems((current) => current.some((item) => item._id === product._id)
    ? current.filter((item) => item._id !== product._id)
    : [...current, product]);
  const remove = (productId: string) => updateItems((current) => current.filter((item) => item._id !== productId));
  const clear = () => updateItems(() => []);

  return { items, has, toggle, remove, clear };
};

export default useWishlist;
