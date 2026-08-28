import { useState } from "react";
import { CartItem } from "../../lib/types/search";

const CART_STORAGE_KEY = "cartData";

const readStoredCart = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    const parsedCart: unknown = storedCart ? JSON.parse(storedCart) : [];
    return Array.isArray(parsedCart) ? parsedCart as CartItem[] : [];
  } catch {
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
};

const persistCart = (items: CartItem[]) => {
  if (items.length === 0) localStorage.removeItem(CART_STORAGE_KEY);
  else localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

const useBasket = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(readStoredCart);

  const updateCart = (updater: (current: CartItem[]) => CartItem[]) => {
    setCartItems((current) => {
      const next = updater(current);
      persistCart(next);
      return next;
    });
  };

  const onAdd = (input: CartItem) => updateCart((current) => {
    const existing = current.find((item) => item._id === input._id);
    if (!existing) return [...current, { ...input, quantity: Math.max(1, input.quantity) }];
    return current.map((item) => item._id === input._id
      ? { ...item, quantity: item.quantity + Math.max(1, input.quantity) }
      : item);
  });

  const onRemove = (input: CartItem) => updateCart((current) => {
    const existing = current.find((item) => item._id === input._id);
    if (!existing) return current;
    if (existing.quantity <= 1) return current.filter((item) => item._id !== input._id);
    return current.map((item) => item._id === input._id
      ? { ...item, quantity: item.quantity - 1 }
      : item);
  });

  const onDelete = (input: CartItem) => updateCart((current) =>
    current.filter((item) => item._id !== input._id));

  const onDeleteAll = () => updateCart(() => []);

  return { cartItems, onAdd, onRemove, onDelete, onDeleteAll };
};

export default useBasket;
