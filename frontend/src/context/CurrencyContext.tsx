import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  CURRENCIES,
  Currency,
  formatCompactCurrency,
  formatCurrency,
  fromDkk,
} from '../utils/format';

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const STORAGE_KEY = 'displayCurrency';

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

const readStored = (): Currency => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return CURRENCIES.includes(stored as Currency) ? (stored as Currency) : 'DKK';
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(readStored);

  const setCurrency = (next: Currency) => {
    localStorage.setItem(STORAGE_KEY, next);
    setCurrencyState(next);
  };

  const value = useMemo(() => ({ currency, setCurrency }), [currency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = (): CurrencyContextValue => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return ctx;
};

// Formatters bound to the display currency. Input is always DKK (what the API
// serves), so call sites never touch conversion themselves.
export const useMoney = () => {
  const { currency } = useCurrency();
  return useMemo(
    () => ({
      money: (value: number) => formatCurrency(fromDkk(value, currency), currency),
      moneyCompact: (value: number) => formatCompactCurrency(fromDkk(value, currency), currency),
    }),
    [currency]
  );
};
