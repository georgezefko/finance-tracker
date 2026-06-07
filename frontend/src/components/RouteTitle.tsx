import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Cashflow',
  '/cashflow': 'Cashflow',
  '/networth': 'Net Worth',
  '/login': 'Sign in',
};

// Keeps the browser tab title in sync with the current route so users can tell
// pages apart (the CRA default was a static "React App"). Renders nothing.
const RouteTitle: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const page = PAGE_TITLES[location.pathname];
    document.title = page ? `${page} · Myfin` : 'Myfin';
  }, [location.pathname]);

  return null;
};

export default RouteTitle;
