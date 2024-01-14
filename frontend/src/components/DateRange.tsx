import React, { createContext, useState, useContext, ReactNode } from 'react';

// Adjusted type to allow Date or null
type DateRangeState = {
  startDate: Date | null;
  endDate: Date | null;
};

type DateRangeContextType = {
  dateRange: DateRangeState;
  setDateRange: (dateRange: DateRangeState) => void;
};

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export const useDateRange = () => {
  const context = useContext(DateRangeContext);
  if (!context) {
    throw new Error('useDateRange must be used within a DateRangeProvider');
  }
  return context;
};

type DateRangeProviderProps = {
  children: ReactNode;
};

export const DateRangeProvider: React.FC<DateRangeProviderProps> = ({ children }) => {
  const [dateRange, setDateRange] = useState<DateRangeState>({
    startDate: new Date(), // or null if you want to start with no date selected
    endDate: new Date(), // or null
  });

  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
};
