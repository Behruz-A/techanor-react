import React, { ReactNode, useState } from "react";
import { Member } from "../../lib/types/member";
import { GlobalContext } from "../hooks/useGlobals";
import useBasket from "../hooks/useBasket";

const readStoredMember = (): Member | null => {
  try {
    const storedMember = localStorage.getItem("memberData");
    return storedMember ? JSON.parse(storedMember) as Member : null;
  } catch {
    localStorage.removeItem("memberData");
    return null;
  }
};

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authMember, setAuthMember] = useState<Member | null>(readStoredMember);

  const [orderBuilder, setOrderBuilder] = useState<Date>(new Date());

  const basket = useBasket();

  return (
    <GlobalContext.Provider
      value={{
        authMember,
        setAuthMember,
        basket,
        orderBuilder,
        setOrderBuilder,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;
