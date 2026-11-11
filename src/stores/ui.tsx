import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { messages, type Locale, type MessageKey } from '../data/i18n';

type Theme = 'dark' | 'light';

type UiValue = {
  locale: Locale;
  direction: 'rtl' | 'ltr';
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  theme: Theme;
  themeLabel: string;
  toggleLocale: () => void;
  toggleTheme: () => void;
  t: (key: MessageKey) => string;
};

const UiContext = createContext<UiValue | null>(null);

function storedLocale(): Locale {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    localStorage.setItem('xelora-locale', 'en');
  }
  return 'en';
}

function readTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function UiProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(storedLocale);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(readTheme);

  const value = useMemo<UiValue>(() => {
    function t(key: MessageKey) {
      return messages[locale][key];
    }

    function applyLocale(next: Locale) {
      setLocale(next);
      if (typeof document === 'undefined') return;
      document.documentElement.lang = next;
      document.documentElement.dir = next === 'fa' ? 'rtl' : 'ltr';
      localStorage.setItem('xelora-locale', next);
    }

    return {
      locale,
      direction: locale === 'fa' ? 'rtl' : 'ltr',
      menuOpen,
      setMenuOpen,
      theme,
      themeLabel: theme === 'dark' ? t('theme.light') : t('theme.dark'),
      toggleLocale: () => applyLocale(locale === 'en' ? 'fa' : 'en'),
      toggleTheme: () => {
        if (typeof document === 'undefined') return;
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        document.documentElement.classList.toggle('dark', next === 'dark');
        localStorage.setItem('xelora-theme', next);
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#0c0e12' : '#f4f6f8');
      },
      t,
    };
  }, [locale, menuOpen, theme]);

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUiStore() {
  const value = useContext(UiContext);
  if (!value) throw new Error('useUiStore must be used within UiProvider');
  return value;
}
