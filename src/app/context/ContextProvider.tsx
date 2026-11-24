import React, { ReactNode, useEffect, useState } from "react";
import { Member } from "../../lib/types/member";
import { GlobalContext } from "../hooks/useGlobals";
import useBasket from "../hooks/useBasket";
import useWishlist from "../hooks/useWishlist";
import MemberService from "../services/MemberService";

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authMember, setAuthMember] = useState<Member | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [orderBuilder, setOrderBuilder] = useState<Date>(new Date());

  const basket = useBasket();
  const wishlist = useWishlist();

  useEffect(() => {
    let isMounted = true;
    new MemberService().getCurrentMember()
      .then((member) => {
        if (isMounted) setAuthMember(member);
      })
      .catch(() => {
        localStorage.removeItem("memberData");
        if (isMounted) setAuthMember(null);
      })
      .finally(() => {
        if (isMounted) setAuthReady(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        authMember,
        authReady,
        setAuthMember,
        basket,
        wishlist,
        orderBuilder,
        setOrderBuilder,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;
