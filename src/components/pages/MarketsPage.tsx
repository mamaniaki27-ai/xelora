import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RefreshCw, Search } from 'lucide-react';
import FavoriteStar from '../FavoriteStar';
import CoinIcon from '../CoinIcon';
import Sparkline from '../Sparkline';
import { marketKey, markets, tagFilters, type Market } from '../../data/markets';
import { changeClass, formatCompact, formatPrice, formatSigned } from '../../lib/format';
import { useLiveTick, wobble } from '../../lib/live';
import { tradePath } from '../../lib/pairs';
import { useTradeStore } from '../../stores/trade';
import { useUiStore } from '../../stores/ui';

export default function MarketsPage() {
  const ui = useUiStore();
  const trade = useTradeStore();
  const location = useLocation();
  const navigate = useNavigate();
  const tick = useLiveTick();

  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<'all' | 'spot' | 'perp'>('all');
  const [tag, setTag] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [updated, setUpdated] = useState<Date | null>(null);
  const [spinning, setSpinning] = useState(false);

  function refresh() {
    setSpinning(true);
    setUpdated(new Date());
    window.setTimeout(() => {
      setSpinning(false);
    }, 500);
  }

  const updatedLabel = useMemo(
    () => (updated
      ? updated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      : 'not yet updated'),
    [updated],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return markets
      .filter((market) => (kind === 'all' ? true : market.kind === kind))
      .filter((market) => (tag === 'all' ? true : market.tags.includes(tag)))
      .filter((market) => (favoritesOnly ? trade.isFavorite(marketKey(market)) : true))
      .filter((market) => !q || `${market.symbol} ${market.pair} ${market.tags.join(' ')}`.toLowerCase().includes(q))
      .map((market) => ({ ...market, live: wobble(market.price, market.symbol.length + (market.kind === 'spot' ? 3 : 0)) }));
  }, [tick, query, kind, tag, favoritesOnly, trade]);

  const volume = useMemo(() => rows.reduce((sum, market) => sum + market.volume, 0), [rows]);

  function openPath(market: Market) {
    return tradePath(market.symbol, market.kind);
  }

  const tabs = useMemo(() => [
    { id: 'all' as const, label: ui.t('markets.all') },
    { id: 'spot' as const, label: ui.t('markets.spot') },
    { id: 'perp' as const, label: ui.t('markets.futures') },
  ], [ui]);

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-4">
      <h1 className="sr-only">{location.pathname === '/crypto-prices' ? 'Crypto prices' : ui.t('nav.markets')}</h1>
      <label className="flex items-center gap-2 border-b border-line py-2.5">
        <Search className="h-4 w-4 shrink-0 text-muted" />
        <span className="sr-only">Search markets</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="field h-8 text-sm" placeholder="Search markets..." />
      </label>

      <div className="flex gap-6 border-b border-line" role="tablist" aria-label="Market type">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`relative h-9 text-sm font-semibold ${kind === tab.id && !favoritesOnly ? 'text-ink' : 'text-muted'}`}
            onClick={() => {
              setKind(tab.id);
              setFavoritesOnly(false);
            }}
          >
            {tab.label}
            {kind === tab.id && !favoritesOnly ? <span className="absolute inset-x-0 -bottom-px h-[2px] bg-mint" /> : null}
          </button>
        ))}
        <button
          type="button"
          className={`relative h-9 text-sm font-semibold ${favoritesOnly ? 'text-ink' : 'text-muted'}`}
          onClick={() => setFavoritesOnly((value) => !value)}
        >
          {ui.t('markets.favorites')}
          {favoritesOnly ? <span className="absolute inset-x-0 -bottom-px h-[2px] bg-mint" /> : null}
        </button>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          className={`inline-flex h-7 shrink-0 items-center rounded px-3 text-xs font-semibold leading-none ${tag === 'all' ? 'border border-mint/70 bg-mint/10 text-mint' : 'border border-line bg-elev text-muted'}`}
          onClick={() => setTag('all')}
        >
          All tags
        </button>
        {tagFilters.map((item) => (
          <button
            key={item}
            type="button"
            className={`inline-flex h-7 shrink-0 items-center rounded px-3 text-xs font-semibold leading-none ${tag === item ? 'border border-mint/70 bg-mint/10 text-mint' : 'border border-line bg-elev text-muted'}`}
            onClick={() => setTag(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted">
        <p>
          <span className="text-mint">●</span>
          {' '}
          {updated ? 'Live' : 'Connecting…'} · updated {updatedLabel} · {rows.length} · {formatCompact(volume)}
        </p>
        <button type="button" className="inline-grid h-[30px] w-[30px] place-items-center rounded-none text-muted" aria-label="Refresh markets" onClick={() => refresh()}>
          <RefreshCw className={`h-4 w-4 ${spinning ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="mt-2">
        <div className="hidden grid-cols-[minmax(0,2.6fr)_minmax(7rem,1fr)_minmax(8rem,1fr)_minmax(7rem,1fr)_5.5rem] px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted md:grid">
          <span>Market</span>
          <span className="text-end">Price</span>
          <span className="text-end">24h Change</span>
          <span className="text-end">24h Volume</span>
          <span className="text-end">Chart</span>
        </div>
        {rows.map((market) => (
          <div
            key={marketKey(market)}
            role="link"
            tabIndex={0}
            className="grid cursor-pointer grid-cols-1 items-center rounded-none border-t border-line px-4 py-3 transition-colors hover:bg-white/[0.02] md:grid-cols-[minmax(0,2.6fr)_minmax(7rem,1fr)_minmax(8rem,1fr)_minmax(7rem,1fr)_5.5rem]"
            onClick={() => navigate(openPath(market))}
            onKeyDown={(event) => {
              if (event.key === 'Enter') navigate(openPath(market));
            }}
          >
            <div className="flex min-w-0 items-center gap-2">
              <FavoriteStar id={marketKey(market)} />
              <CoinIcon symbol={market.symbol} size={32} />
              <div className="min-w-0 leading-tight">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-sm font-bold">{market.symbol}</span>
                  {market.featured ? <span className="rounded bg-amber-500/10 px-1 py-0.5 text-[9px] font-bold leading-none text-amber-500">FEATURED</span> : null}
                  <span className="rounded bg-white/[0.06] px-1 py-0.5 text-[9px] font-bold leading-none text-slate-400">{market.kind === 'perp' ? 'PERP' : 'SPOT'}</span>
                  {market.kind === 'perp' ? <span className="rounded bg-amber-500/10 px-1 py-0.5 text-[9px] font-bold leading-none text-amber-500">{market.maxLeverage}×</span> : null}
                </div>
                <p className="mt-0.5 text-[10px] font-medium text-slate-400">{market.pair}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {market.tags.map((item) => (
                    <span key={item} className="rounded bg-sky-400/10 px-1 py-0.5 text-[8px] leading-none text-sky-300">{item}</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-2 text-end text-sm font-bold num text-[#a8dccb] md:mt-0">{formatPrice(market.live)}</p>
            <div className="mt-1 text-end md:mt-0">
              <p className={`text-sm font-bold num ${changeClass(market.change)}`}>{formatSigned(market.change)}</p>
              {market.funding !== undefined ? <p className="text-[10px] text-slate-400">fund {market.funding.toFixed(4)}% · {market.nextFundingMin}m</p> : null}
            </div>
            <div className="mt-1 text-end text-sm num text-slate-400 md:mt-0">
              <p>{formatCompact(market.volume)}</p>
              {market.openInterest ? <p className="text-[10px]">OI {formatCompact(market.openInterest)}</p> : null}
            </div>
            <div className="mt-2 flex justify-end md:mt-0">
              <Sparkline symbol={market.symbol} price={market.price} change={market.change} />
            </div>
          </div>
        ))}
        {rows.length === 0 ? <p className="py-10 text-center text-sm text-muted">{ui.t('markets.empty')}</p> : null}
      </div>
    </section>
  );
}
