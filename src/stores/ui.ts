import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { messages, type Locale, type MessageKey } from '../data/i18n';

function storedLocale(): Locale {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    localStorage.setItem('xelora-locale', 'en');
  }
  return 'en';
}

function readTheme(): 'dark' | 'light' {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export const useUiStore = defineStore('ui', () => {
  const locale = ref<Locale>(storedLocale());
  const menuOpen = ref(false);
  const theme = ref<'dark' | 'light'>(readTheme());

  const direction = computed(() => (locale.value === 'fa' ? 'rtl' : 'ltr'));

  function applyLocale(next: Locale) {
    locale.value = next;
    if (typeof document === 'undefined') return;
    document.documentElement.lang = next;
    document.documentElement.dir = next === 'fa' ? 'rtl' : 'ltr';
    localStorage.setItem('xelora-locale', next);
  }

  function toggleLocale() {
    applyLocale(locale.value === 'en' ? 'fa' : 'en');
  }

  function toggleTheme() {
    if (typeof document === 'undefined') return;
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', theme.value === 'dark');
    localStorage.setItem('xelora-theme', theme.value);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.value === 'dark' ? '#0c0e12' : '#f4f6f8');
  }

  const themeLabel = computed(() => (theme.value === 'dark' ? t('theme.light') : t('theme.dark')));

  function t(key: MessageKey) {
    return messages[locale.value][key];
  }

  return { locale, direction, menuOpen, theme, themeLabel, toggleLocale, toggleTheme, t };
});
