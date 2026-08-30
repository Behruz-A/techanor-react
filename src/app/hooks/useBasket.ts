import { useMemo, useState } from "react";
import { CartItem } from "../../lib/types/search";

const CART_STORAGE_KEY = "cartData";
const CART_SCHEMA_KEY = "cartDataSchema";
const CART_SCHEMA_VERSION = "2";
const LEGACY_CART_STOCK_FALLBACK = 99;

const normalizeCartItem = (value: unknown, isLegacyCart: boolean): CartItem | null => {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<CartItem>;
  const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
  const storedMaximum = Math.floor(Number(item.maxQuantity));
  const maxQuantity = !isLegacyCart && Number.isFinite(storedMaximum) && storedMaximum > 0
    ? storedMaximum
    : Math.max(quantity, LEGACY_CART_STOCK_FALLBACK);

  if (typeof item._id !== "string" || !item._id || typeof item.name !== "string" ||
    typeof item.image !== "string" || !Number.isFinite(Number(item.price)) || Number(item.price) < 0) return null;

  return { _id: item._id, name: item.name, image: item.image, price: Number(item.price),
    maxQuantity, quantity: Math.min(quantity, maxQuantity) };
};

const readStoredCart = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    const isLegacyCart = localStorage.getItem(CART_SCHEMA_KEY) !== CART_SCHEMA_VERSION;
    const parsedCart: unknown = storedCart ? JSON.parse(storedCart) : [];
    return Array.isArray(parsedCart)
      ? parsedCart.map((item) => normalizeCartItem(item, isLegacyCart)).filter((item): item is CartItem => item !== null)
      : [];
  } catch {
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
};

const persistCart = (items: CartItem[]) => {
  if (items.length === 0) {
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(CART_SCHEMA_KEY);
  } else {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    localStorage.setItem(CART_SCHEMA_KEY, CART_SCHEMA_VERSION);
  }
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
    const maxQuantity = Math.max(0, Math.floor(Number(input.maxQuantity) || 0));
    if (maxQuantity === 0) return current;
    const requestedQuantity = Math.max(1, Math.floor(Number(input.quantity) || 1));
    const existing = current.find((item) => item._id === input._id);
    if (!existing) return [...current, { ...input, maxQuantity, quantity: Math.min(requestedQuantity, maxQuantity) }];
    return current.map((item) => item._id === input._id
      ? { ...item, ...input, maxQuantity, quantity: Math.min(item.quantity + requestedQuantity, maxQuantity) }
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

  const itemCount = useMemo(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems]);
  const subtotal = useMemo(() => cartItems.reduce((total, item) => total + item.quantity * item.price, 0), [cartItems]);

  return { cartItems, itemCount, subtotal, onAdd, onRemove, onDelete, onDeleteAll };
};

export default useBasket;
