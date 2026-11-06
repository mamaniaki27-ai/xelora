<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import {
  Activity,
  AlertTriangle,
  ArrowLeftRight,
  BookOpen,
  Calculator,
  CandlestickChart,
  ChevronDown,
  CircleDollarSign,
  Coins,
  Compass,
  FileCode,
  GraduationCap,
  House,
  Info,
  LayoutGrid,
  Library,
  LineChart,
  Megaphone,
  Menu,
  Moon,
  MoreHorizontal,
  Newspaper,
  Percent,
  Radar,
  Search,
  Sun,
  TrendingUp,
  Users,
  Wallet,
  Wrench,
} from 'lucide-vue-next';
import LogoMark from './LogoMark.vue';
import { useUiStore } from '../../stores/ui';
import { useSessionStore } from '../../stores/session';

type NavLink = { label: string; to: string; icon: typeof House };
type NavItem = {
  label: string;
  to?: string;
  icon: typeof House;
  children?: NavLink[];
};

const route = useRoute();
const router = useRouter();
const ui = useUiStore();
const session = useSessionStore();
const openMenu = ref('');

const items: NavItem[] = [
  { label: 'Home', to: '/', icon: House },
  { label: 'Markets', to: '/markets', icon: LineChart },
  { label: 'Spot', to: '/spot', icon: CandlestickChart },
  { label: 'Futures', to: '/futures', icon: TrendingUp },
  { label: 'Swap', to: '/swap', icon: ArrowLeftRight },
  {
    label: 'Explore',
    icon: Compass,
    children: [
      { label: 'Market Pulse & Watchlist', to: '/market-pulse', icon: Activity },
      { label: 'Funding & Liquidation Radar', to: '/funding-radar', icon: Radar },
      { label: 'Indicator Screener', to: '/screener', icon: Search },
      { label: 'Trading Journal', to: '/journal', icon: BookOpen },
      { label: 'Referrals', to: '/referrals', icon: Users },
      { label: 'Announcements', to: '/announcements', icon: Megaphone },
      { label: 'Crypto Prices', to: '/crypto-prices', icon: Coins },
    ],
  },
  {
    label: 'Tools',
    icon: Wrench,
    children: [
      { label: 'All Tools', to: '/tools', icon: LayoutGrid },
      { label: 'Profit Calculator', to: '/tools/profit-calculator', icon: Calculator },
      { label: 'Position Size & Risk', to: '/tools/position-risk-calculator', icon: AlertTriangle },
      { label: 'Liquidation Calculator', to: '/tools/liquidation-calculator', icon: AlertTriangle },
      { label: 'Futures PnL Calculator', to: '/tools/futures-pnl-calculator', icon: TrendingUp },
      { label: 'Funding Rate Calculator', to: '/tools/funding-rate-calculator', icon: Percent },
    ],
  },
  {
    label: 'More',
    icon: MoreHorizontal,
    children: [
      { label: 'Blog', to: '/blog', icon: Newspaper },
      { label: 'Learn', to: '/learn', icon: GraduationCap },
      { label: 'Trading Guide', to: '/how-to-trade', icon: BookOpen },
      { label: 'Wallet Guide', to: '/how-to-use-wallet', icon: Wallet },
      { label: 'Guides & Education', to: '/guide', icon: Library },
      { label: 'About', to: '/about', icon: Info },
      { label: 'Xelo Token', to: '/token', icon: CircleDollarSign },
      { label: 'API Documentation', to: '/api-docs', icon: FileCode },
    ],
  },
];

function active(path: string) {
  if (path === '/') return route.path === '/';
  if (path === '/futures') return route.path === '/futures' || route.path.endsWith('-futures');
  if (path === '/spot') return route.path === '/spot' || (route.path.startsWith('/trade/') && !route.path.endsWith('-futures'));
  return route.path === path || route.path.startsWith(`${path}/`);
}

function itemActive(item: NavItem) {
  if (item.to) return active(item.to);
  return item.children?.some((child) => active(child.to)) ?? false;
}

function toggleDrop(label: string) {
  openMenu.value = openMenu.value === label ? '' : label;
}

const themeLabel = computed(() => (ui.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'));

watch(
  () => route.path,
  () => {
    openMenu.value = '';
  },
);
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-line bg-bg">
    <div class="flex h-14 w-full items-center gap-2 px-3 sm:px-4">
      <RouterLink to="/" class="flex shrink-0 items-center gap-2 text-mint" aria-label="XELORA home">
        <LogoMark />
        <span class="text-[15px] font-bold tracking-[0.14em]">XELORA</span>
      </RouterLink>

      <nav class="ms-3 hidden items-center gap-1 min-[1080px]:flex" aria-label="Primary">
        <template v-for="item in items" :key="item.label">
          <RouterLink
            v-if="item.to"
            :to="item.to"
            class="inline-flex h-8 w-[6.75rem] items-center justify-center gap-1 rounded-md text-sm font-semibold leading-none uppercase"
            :class="itemActive(item) ? 'text-mint' : 'text-ink/90 hover:text-ink'"
          >
            <component :is="item.icon" class="h-3.5 w-3.5 shrink-0" />
            {{ item.label }}
          </RouterLink>
          <div v-else class="relative">
            <button
              type="button"
              class="inline-flex h-8 w-[6.75rem] items-center justify-center gap-1 rounded-md text-sm font-semibold leading-none uppercase"
              :class="itemActive(item) || openMenu === item.label ? 'text-mint' : 'text-ink/90 hover:text-ink'"
              :aria-expanded="openMenu === item.label"
              @click="toggleDrop(item.label)"
            >
              <component :is="item.icon" class="h-3.5 w-3.5 shrink-0" />
              {{ item.label }}
              <ChevronDown class="h-3.5 w-3.5 shrink-0" />
            </button>
            <div
              v-if="openMenu === item.label"
              class="absolute start-0 top-full z-50 mt-2 w-[280px] rounded-xl border border-line bg-elev p-1"
            >
              <RouterLink
                v-for="child in item.children"
                :key="child.label"
                :to="child.to"
                class="flex h-8 w-full items-center gap-1.5 rounded-md px-2 text-sm font-semibold leading-none text-ink/90 hover:bg-soft"
              >
                <component :is="child.icon" class="h-3.5 w-3.5 shrink-0" />
                {{ child.label }}
              </RouterLink>
            </div>
          </div>
        </template>
      </nav>

      <div class="ms-auto flex shrink-0 items-center gap-2">
        <button type="button" class="mint-btn wallet-square hidden h-9 px-3.5 sm:inline-flex" @click="session.address ? router.push('/wallet') : session.openGate()">
          <Wallet class="h-4 w-4" />
          Wallet
        </button>
        <button type="button" class="ghost-btn hidden h-9 px-3.5 sm:inline-flex" @click="session.address ? session.disconnect() : session.openPicker()">
          <span v-if="session.address" class="h-1.5 w-1.5 rounded-full bg-mint" />
          {{ session.connecting ? 'Connecting…' : session.address ? session.shortAddress : 'Connect Wallet' }}
        </button>
        <button type="button" class="icon-btn inline-grid min-[1080px]:hidden" aria-label="Open navigation menu" @click="ui.menuOpen = true">
          <Menu class="h-4 w-4" />
        </button>
        <button type="button" class="icon-btn inline-grid" :aria-label="themeLabel" @click="ui.toggleTheme()">
          <Sun class="hidden h-4 w-4 dark:block" />
          <Moon class="h-4 w-4 dark:hidden" />
        </button>
      </div>
    </div>

    <div v-if="ui.menuOpen" class="fixed inset-0 z-50 bg-black/60 min-[1080px]:hidden" @click.self="ui.menuOpen = false">
      <nav class="ms-auto flex h-full w-[min(100%,320px)] flex-col gap-1 overflow-y-auto bg-elev p-4" aria-label="Open navigation menu">
        <template v-for="item in items" :key="item.label">
          <RouterLink
            v-if="item.to"
            :to="item.to"
            class="inline-flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold"
            :class="itemActive(item) ? 'text-mint' : 'text-ink/70'"
          >
            <component :is="item.icon" class="h-4 w-4" />
            {{ item.label }}
          </RouterLink>
          <p v-else class="mt-3 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{{ item.label }}</p>
          <RouterLink
            v-for="child in item.children ?? []"
            :key="child.label"
            :to="child.to"
            class="flex h-8 items-center gap-2 rounded-md px-2 text-[13px] font-semibold text-ink/80"
          >
            <component :is="child.icon" class="h-4 w-4 shrink-0" />
            {{ child.label }}
          </RouterLink>
        </template>
        <RouterLink to="/wallet" class="mt-2 rounded-xl px-3 py-3 text-sm font-semibold text-ink/70">Wallet</RouterLink>
      </nav>
    </div>
  </header>
</template>
