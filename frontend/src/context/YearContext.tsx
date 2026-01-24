import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch } from '../utils/apiFetch';
import { AuthContext } from './AuthContext';

const baseUrl = process.env.BASE_URL || 'http://localhost:8000';

interface YearContextValue {
  year: number;
  setYear: (year: number) => void;
  years: number[];
}

const YearContext = createContext<YearContextValue | undefined>(undefined);


export const YearProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    if (!authContext?.token) return;

    const fetchYears = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authContext.token}`,
        };

        const res = await apiFetch(
          `${baseUrl}/api/cashflow/years`,
          { headers },
          authContext
        );
        const data: number[] = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setYears(data);
          setYear(data[0]); // default to latest
        }
      } catch (err) {
        console.error('Error fetching years:', err);
      }
    };

    fetchYears();
  }, [authContext?.token]);

  return (
    <YearContext.Provider value={{ year, setYear, years }}>
      {children}
    </YearContext.Provider>
  );
};

export const useYear = (): YearContextValue => {
  const ctx = useContext(YearContext);
  if (!ctx) {
    throw new Error('useYear must be used within a YearProvider');
  }
  return ctx;
};