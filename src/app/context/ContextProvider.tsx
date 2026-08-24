import React, { ReactNode, useState } from "react";
import Cookies from "universal-cookie";
import { Member } from "../../lib/types/member";
import { GlobalContext } from "../hooks/useGlobals";
import useBasket from "../hooks/useBasket";

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const cookies = new Cookies();

  if (!cookies.get("accessToken")) {
    localStorage.removeItem("memberData");
  }

  const [authMember, setAuthMember] = useState<Member | null>(
    localStorage.getItem("memberData")
      ? JSON.parse(localStorage.getItem("memberData") as string)
      : null,
  );

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
