import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeftRight, CandlestickChart, House, LineChart, Wallet } from 'lucide-react';
import { useUiStore } from '../../stores/ui';

export default function MobileNav() {
  const location = useLocation();
  const ui = useUiStore();

  const items = useMemo(
    () => [
      { label: ui.t('nav.home'), to: '/', icon: House, fab: false },
      { label: ui.t('nav.markets'), to: '/markets', icon: LineChart, fab: false },
      { label: ui.t('nav.swap'), to: '/swap', icon: ArrowLeftRight, fab: true },
      { label: ui.t('nav.trade'), to: '/futures', icon: CandlestickChart, fab: false },
      { label: ui.t('nav.wallet'), to: '/wallet', icon: Wallet, fab: false },
    ],
    [ui],
  );

  function active(path: string) {
    if (path === '/') return location.pathname === '/';
    if (path === '/futures') return location.pathname === '/futures' || location.pathname === '/spot' || location.pathname.startsWith('/trade/');
    return location.pathname === path;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 backdrop-blur lg:hidden" aria-label="Main mobile navigation">
      <ul className="grid grid-cols-5 px-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.to} className="flex justify-center">
              <Link
                to={item.to}
                className={`flex min-h-14 w-full flex-col items-center justify-end gap-1 pb-1 text-[10px] font-semibold ${active(item.to) ? 'text-mint' : 'text-muted'}`}
              >
                {item.fab ? (
                  <span className="-mt-7 grid h-14 w-14 place-items-center rounded-full bg-mint text-mint-ink">
                    <Icon className="h-5 w-5" />
                  </span>
                ) : (
                  <Icon className="h-5 w-5" />
                )}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
