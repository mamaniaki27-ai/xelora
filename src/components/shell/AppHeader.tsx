import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import LogoMark from './LogoMark';
import { useUiStore } from '../../stores/ui';
import { useSessionStore } from '../../stores/session';

type NavLink = { label: string; to: string; icon: typeof House };
type NavItem = {
  label: string;
  to?: string;
  icon: typeof House;
  children?: NavLink[];
};

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

export default function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const ui = useUiStore();
  const session = useSessionStore();
  const [openMenu, setOpenMenu] = useState('');

  const themeLabel = useMemo(() => (ui.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'), [ui.theme]);

  useEffect(() => {
    setOpenMenu('');
  }, [location.pathname]);

  function active(path: string) {
    if (path === '/') return location.pathname === '/';
    if (path === '/futures') return location.pathname === '/futures' || location.pathname.endsWith('-futures');
    if (path === '/spot') return location.pathname === '/spot' || (location.pathname.startsWith('/trade/') && !location.pathname.endsWith('-futures'));
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }

  function itemActive(item: NavItem) {
    if (item.to) return active(item.to);
    return item.children?.some((child) => active(child.to)) ?? false;
  }

  function toggleDrop(label: string) {
    setOpenMenu((current) => (current === label ? '' : label));
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <div className="flex h-14 w-full items-center gap-2 px-3 sm:px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2 text-mint" aria-label="XELORA home">
          <LogoMark />
          <span className="text-[15px] font-bold tracking-[0.14em]">XELORA</span>
        </Link>

        <nav className="ms-3 hidden items-center gap-1 min-[1080px]:flex" aria-label="Primary">
          {items.map((item) => {
            const Icon = item.icon;
            if (item.to) {
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`inline-flex h-8 w-[6.75rem] items-center justify-center gap-1 rounded-md text-sm font-semibold leading-none uppercase ${itemActive(item) ? 'text-mint' : 'text-ink/90 hover:text-ink'}`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {item.label}
                </Link>
              );
            }
            return (
              <div key={item.label} className="relative">
                <button
                  type="button"
                  className={`inline-flex h-8 w-[6.75rem] items-center justify-center gap-1 rounded-md text-sm font-semibold leading-none uppercase ${itemActive(item) || openMenu === item.label ? 'text-mint' : 'text-ink/90 hover:text-ink'}`}
                  aria-expanded={openMenu === item.label}
                  onClick={() => toggleDrop(item.label)}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                </button>
                {openMenu === item.label ? (
                  <div className="absolute start-0 top-full z-50 mt-2 w-[280px] rounded-xl border border-line bg-elev p-1">
                    {item.children?.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <Link
                          key={child.label}
                          to={child.to}
                          className="flex h-8 w-full items-center gap-1.5 rounded-md px-2 text-sm font-semibold leading-none text-ink/90 hover:bg-soft"
                        >
                          <ChildIcon className="h-3.5 w-3.5 shrink-0" />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="ms-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="mint-btn wallet-square hidden h-9 px-3.5 sm:inline-flex"
            onClick={() => (session.address ? navigate('/wallet') : session.openGate())}
          >
            <Wallet className="h-4 w-4" />
            Wallet
          </button>
          <button
            type="button"
            className="ghost-btn hidden h-9 px-3.5 sm:inline-flex"
            onClick={() => (session.address ? session.disconnect() : session.openPicker())}
          >
            {session.address ? <span className="h-1.5 w-1.5 rounded-full bg-mint" /> : null}
            {session.connecting ? 'Connecting…' : session.address ? session.shortAddress : 'Connect Wallet'}
          </button>
          <button type="button" className="icon-btn inline-grid min-[1080px]:hidden" aria-label="Open navigation menu" onClick={() => ui.setMenuOpen(true)}>
            <Menu className="h-4 w-4" />
          </button>
          <button type="button" className="icon-btn inline-grid" aria-label={themeLabel} onClick={() => ui.toggleTheme()}>
            <Sun className="hidden h-4 w-4 dark:block" />
            <Moon className="h-4 w-4 dark:hidden" />
          </button>
        </div>
      </div>

      {ui.menuOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/60 min-[1080px]:hidden"
          onClick={(event) => {
            if (event.target === event.currentTarget) ui.setMenuOpen(false);
          }}
        >
          <nav className="ms-auto flex h-full w-[min(100%,320px)] flex-col gap-1 overflow-y-auto bg-elev p-4" aria-label="Open navigation menu">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Fragment key={item.label}>
                  {item.to ? (
                    <Link
                      to={item.to}
                      className={`inline-flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold ${itemActive(item) ? 'text-mint' : 'text-ink/70'}`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ) : (
                    <p className="mt-3 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{item.label}</p>
                  )}
                  {(item.children ?? []).map((child) => {
                    const ChildIcon = child.icon;
                    return (
                      <Link key={child.label} to={child.to} className="flex h-8 items-center gap-2 rounded-md px-2 text-[13px] font-semibold text-ink/80">
                        <ChildIcon className="h-4 w-4 shrink-0" />
                        {child.label}
                      </Link>
                    );
                  })}
                </Fragment>
              );
            })}
            <Link to="/wallet" className="mt-2 rounded-xl px-3 py-3 text-sm font-semibold text-ink/70">
              Wallet
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
