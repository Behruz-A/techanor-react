import { createContext, useContext } from "react";
import { Member } from "../../lib/types/member";
import useBasket from "./useBasket";
import useWishlist from "./useWishlist";

interface GlobalInterface {
  authMember: Member | null;
  setAuthMember: (member: Member | null) => void;
  basket: ReturnType<typeof useBasket>;
  wishlist: ReturnType<typeof useWishlist>;
  orderBuilder: Date;
  setOrderBuilder: (input: Date) => void;
}

export const GlobalContext = createContext<GlobalInterface | undefined>(
  undefined,
);

export const useGlobals = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) throw new Error("useGlobals within Provider");

  return context;
};
