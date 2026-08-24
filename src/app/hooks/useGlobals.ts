import { createContext, useContext } from "react";
import { Member } from "../../lib/types/member";
import useBasket from "./useBasket";

interface GlobalInterface {
  authMember: Member | null;
  setAuthMember: (member: Member | null) => void;
  basket: ReturnType<typeof useBasket>;
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
