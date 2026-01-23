import React, { createContext, useContext, useState, ReactNode } from 'react';

interface YearContextType {
  year: number;
  setYear: (year: number) => void;
}

const YearContext = createContext<YearContextType | undefined>(undefined);

interface YearProviderProps {
  children: ReactNode;
}

export const YearProvider: React.FC<YearProviderProps> = ({ children }) => {
  // You can set this to new Date().getFullYear() later if you want,
  // but for now 2025 matches your data.
  const [year, setYear] = useState<number>(2025);

  return (
    <YearContext.Provider value={{ year, setYear }}>
      {children}
    </YearContext.Provider>
  );
};

export const useYear = (): YearContextType => {
  const ctx = useContext(YearContext);
  if (!ctx) {
    throw new Error('useYear must be used within a YearProvider');
  }
  return ctx;
};