import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const ThemeContext = createContext(null);
const THEME_STORAGE_KEY = 'ui.theme';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') setTheme(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('theme-dark');
      root.classList.remove('theme-light');
    } else {
      root.classList.add('theme-light');
      root.classList.remove('theme-dark');
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggle }), [theme, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}



