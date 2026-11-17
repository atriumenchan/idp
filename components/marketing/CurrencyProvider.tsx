"use client";

import { CURRENCIES, type CurrencyCode } from "@/lib/currencies";
import { createContext, useContext, useEffect, useState } from "react";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
};

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "usd",
  setCurrency: () => undefined,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("usd");

  useEffect(() => {
    const saved = window.localStorage.getItem("halden-currency");
    if (saved && CURRENCIES.some((item) => item.code === saved)) {
      setCurrencyState(saved as CurrencyCode);
    }
  }, []);

  function setCurrency(next: CurrencyCode) {
    setCurrencyState(next);
    window.localStorage.setItem("halden-currency", next);
  }

  return <CurrencyContext.Provider value={{ currency, setCurrency }}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
