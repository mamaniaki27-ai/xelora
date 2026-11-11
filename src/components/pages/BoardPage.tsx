import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CoinIcon from '../CoinIcon';
import FavoriteStar from '../FavoriteStar';
import Sparkline from '../Sparkline';
import { marketKey, markets, tagFilters, type Market } from '../../data/markets';
import { changeClass, formatCompact, formatPrice, formatSigned } from '../../lib/format';
import { tradePath } from '../../lib/pairs';

function openPath(market: Market) {
  return tradePath(market.symbol, market.kind);
}

export default function BoardPage({ mode }: { mode: 'pulse' | 'funding' | 'screener' }) {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('all');

  const title = useMemo(() => {
    if (mode === 'funding') return 'Funding & liquidation radar';
    if (mode === 'screener') return 'Indicator screener';
    return 'Market pulse & watchlist';
  }, [mode]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return markets
      .filter((market) => market.kind === 'perp')
      .filter((market) => (tag === 'all' ? true : market.tags.includes(tag)))
      .filter((market) => !q || `${market.symbol} ${market.pair} ${market.tags.join(' ')}`.toLowerCase().includes(q))
      .slice()
      .sort((a, b) => {
        if (mode === 'funding') return Math.abs(b.funding ?? 0) - Math.abs(a.funding ?? 0);
        return Math.abs(b.change) - Math.abs(a.change);
      });
  }, [query, tag, mode]);

  const volume = rows.reduce((sum, market) => sum + market.volume, 0);

  return (
    <section className="mx-auto w-full max-w-[1100px] px-4 py-8">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-muted">Search the published perpetual list. Figures are the local market snapshot.</p>
      <form className="mt-5" role="search" onSubmit={(event) => event.preventDefault()}>
        <label className="block">
          <span className="sr-only">Search markets</span>
          <input
            className="field w-full rounded-xl border border-line bg-elev px-4 py-2.5 sm:max-w-md"
            placeholder="Search markets..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </form>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          className={`inline-flex h-7 shrink-0 items-center rounded-full px-3 text-xs font-semibold ${tag === 'all' ? 'bg-ink text-bg' : 'bg-soft text-ink'}`}
          onClick={() => setTag('all')}
        >
          All tags
        </button>
        {tagFilters.map((item) => (
          <button
            key={item}
            type="button"
            className={`inline-flex h-7 shrink-0 items-center rounded-full px-3 text-xs font-semibold ${tag === item ? 'bg-ink text-bg' : 'bg-soft text-ink'}`}
            onClick={() => setTag(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="text-xs uppercase text-muted">
            <tr>
              <th className="px-2 py-2 text-start font-medium">Market</th>
              <th className="px-2 py-2 text-end font-medium">Price</th>
              <th className="px-2 py-2 text-end font-medium">{mode === 'funding' ? 'Funding' : '24h'}</th>
              <th className="px-2 py-2 text-end font-medium">Chart</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((market) => (
              <tr key={marketKey(market)} className="border-t border-line">
                <td className="px-2 py-3">
                  <div className="flex items-center gap-2">
                    <FavoriteStar id={marketKey(market)} />
                    <CoinIcon symbol={market.symbol} size={32} />
                    <Link to={openPath(market)}>
                      <span className="block font-semibold">{market.symbol}</span>
                      <span className="block text-xs text-muted">{market.pair}</span>
                    </Link>
                  </div>
                </td>
                <td className="px-2 py-3 text-end font-semibold num">{formatPrice(market.price)}</td>
                <td className={`px-2 py-3 text-end font-semibold num ${changeClass(mode === 'funding' ? (market.funding ?? 0) : market.change)}`}>
                  {mode === 'funding' ? `${(market.funding ?? 0).toFixed(4)}%` : formatSigned(market.change)}
                </td>
                <td className="px-2 py-3">
                  <div className="flex justify-end"><Sparkline symbol={market.symbol} price={market.price} change={market.change} /></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? <p className="py-10 text-center text-sm text-muted">No markets match that search.</p> : null}
      </div>
      <p className="mt-4 text-xs text-muted">{rows.length} markets · {formatCompact(volume)} volume</p>
    </section>
  );
}
