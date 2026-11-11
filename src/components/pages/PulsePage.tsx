import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CoinIcon from '../CoinIcon';
import Sparkline from '../Sparkline';
import { markets, marketKey } from '../../data/markets';
import { changeClass, formatCompact, formatPrice, formatSigned } from '../../lib/format';
import { useLiveTick, wobble } from '../../lib/live';
import { tradePath } from '../../lib/pairs';

function readList() {
  if (typeof localStorage === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem('xelora-watchlist') || '[]');
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export default function PulsePage() {
  const tick = useLiveTick();
  const [watchlist, setWatchlist] = useState<string[]>(readList);
  const [pick, setPick] = useState('');

  const live = useMemo(() => {
    return markets.map((market) => ({ ...market, live: wobble(market.price, market.symbol.length) }));
  }, [tick]);

  const movers = useMemo(() => [...live].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 10), [live]);
  const saved = useMemo(() => live.filter((market) => watchlist.includes(marketKey(market))), [live, watchlist]);

  function add() {
    if (!pick || watchlist.includes(pick)) return;
    const next = [pick, ...watchlist];
    setWatchlist(next);
    localStorage.setItem('xelora-watchlist', JSON.stringify(next));
    setPick('');
  }

  function remove(key: string) {
    const next = watchlist.filter((item) => item !== key);
    setWatchlist(next);
    localStorage.setItem('xelora-watchlist', JSON.stringify(next));
  }

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint">Explore</p>
      <h1 className="mt-2 text-3xl font-semibold">Market Pulse</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        A clearer view of verified market moves, data freshness, and the assets you follow. Prices on this page are the local market book, refreshed while the tab is open.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <article className="panel p-4"><p className="text-xs text-muted">Verified movers</p><p className="mt-1 text-2xl font-semibold num">{movers.length}</p></article>
        <article className="panel p-4"><p className="text-xs text-muted">Selectable</p><p className="mt-1 text-2xl font-semibold num">{live.length}</p></article>
        <article className="panel p-4"><p className="text-xs text-muted">Watchlist</p><p className="mt-1 text-2xl font-semibold num">{saved.length}</p></article>
        <article className="panel p-4"><p className="text-xs text-muted">Shared market stream</p><p className="mt-1 text-lg font-semibold text-mint">live</p></article>
        <article className="panel p-4"><p className="text-xs text-muted">Perpetual context</p><p className="mt-1 text-lg font-semibold">{live.filter((m) => m.kind === 'perp').length} markets</p></article>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <section className="panel p-4" aria-label="Largest 24-hour moves">
          <h2 className="text-lg font-semibold">Largest 24-hour moves</h2>
          <p className="mt-1 text-sm text-muted">Up to 10 markets with a previous-day comparison and a fresh local context.</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-2 py-2 text-start font-medium">Market</th>
                  <th className="px-2 py-2 text-end font-medium">Last</th>
                  <th className="px-2 py-2 text-end font-medium">24h</th>
                  <th className="px-2 py-2 text-end font-medium">Volume</th>
                  <th className="px-2 py-2 text-end font-medium">Chart</th>
                </tr>
              </thead>
              <tbody>
                {movers.map((market) => (
                  <tr key={marketKey(market)} className="border-t border-line">
                    <td className="px-2 py-3">
                      <Link to={tradePath(market.symbol, market.kind)} className="flex items-center gap-2 font-semibold">
                        <CoinIcon symbol={market.symbol} size={28} />
                        {market.pair}
                        <span className="text-xs font-medium text-muted">{market.kind === 'perp' ? 'Perp' : 'Spot'}</span>
                      </Link>
                    </td>
                    <td className="px-2 py-3 text-end num">{formatPrice(market.live)}</td>
                    <td className={`px-2 py-3 text-end num ${changeClass(market.change)}`}>{formatSigned(market.change)}</td>
                    <td className="px-2 py-3 text-end num text-muted">{formatCompact(market.volume)}</td>
                    <td className="px-2 py-3"><Sparkline symbol={market.symbol} price={market.price} change={market.change} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid gap-4">
          <section className="panel p-4" aria-label="Build your Watchlist">
            <h2 className="text-lg font-semibold">Build your Watchlist</h2>
            <p className="mt-1 text-sm text-muted">Only markets in the published catalog can be added. Saved in this browser.</p>
            <label className="mt-3 block text-sm">
              <span className="text-xs text-muted">Select a market</span>
              <select value={pick} onChange={(event) => setPick(event.target.value)} className="field mt-1 h-10 rounded-xl border border-line bg-bg px-3">
                <option value="">Choose from verified markets</option>
                {live.map((market) => (
                  <option key={marketKey(market)} value={marketKey(market)}>{market.pair} · {market.kind === 'perp' ? 'Perpetual' : 'Spot'}</option>
                ))}
              </select>
            </label>
            <button type="button" className="mint-btn mt-3 h-10 w-full" disabled={!pick} onClick={() => add()}>Add to Watchlist</button>
          </section>
          <section className="panel p-4" aria-label="Your Watchlist">
            <h2 className="text-lg font-semibold">Your Watchlist</h2>
            {saved.length === 0 ? (
              <p className="mt-3 text-sm text-muted">Your list starts here. Add a verified Spot or Perpetual market above.</p>
            ) : (
              <ul className="mt-3 divide-y divide-line text-sm">
                {saved.map((market) => (
                  <li key={marketKey(market)} className="flex items-center justify-between gap-3 py-2">
                    <span className="flex items-center gap-2 font-semibold"><CoinIcon symbol={market.symbol} size={22} />{market.pair}</span>
                    <span className={`num ${changeClass(market.change)}`}>{formatSigned(market.change)}</span>
                    <button type="button" className="text-xs text-muted" onClick={() => remove(marketKey(market))}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <section className="panel mt-4 p-4">
        <h2 className="text-lg font-semibold">Data transparency</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted">
          Read-only market analytics. The tape refreshes while this page is visible. Capture time is when this browser last drew the book, not an exchange confirmation.
        </p>
      </section>
    </section>
  );
}
