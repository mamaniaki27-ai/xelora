import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CoinIcon from '../CoinIcon';
import { markets } from '../../data/markets';
import { buildCandles } from '../../lib/candles';
import { formatPrice, formatSigned } from '../../lib/format';
import { tradePath } from '../../lib/pairs';
import { useTradeStore } from '../../stores/trade';

type Row = {
  symbol: string;
  pair: string;
  close: number;
  change: number;
  rsi: number;
  atr: number;
  trend: 'Bullish' | 'Bearish';
};

type Preset = 'all' | 'oversold' | 'overbought' | 'bull' | 'bear' | 'gainers' | 'losers' | 'favorites';

const presets: Preset[] = ['all', 'oversold', 'overbought', 'bull', 'bear', 'gainers', 'losers', 'favorites'];

function rsi(closes: number[]) {
  let gain = 0;
  let loss = 0;
  for (let index = 1; index < closes.length; index += 1) {
    const delta = closes[index] - closes[index - 1];
    if (delta >= 0) gain += delta;
    else loss -= delta;
  }
  const count = closes.length - 1;
  if (!count || loss === 0) return 100;
  const relative = gain / loss;
  return 100 - 100 / (1 + relative);
}

export default function ScreenerPage() {
  const trade = useTradeStore();
  const [query, setQuery] = useState('');
  const [resultQuery, setResultQuery] = useState('');
  const [timeframe, setTimeframe] = useState<'15m' | '1H' | '4H' | '24H'>('15m');
  const [selected, setSelected] = useState<string[]>(['BTC', 'ETH', 'SOL']);
  const [preset, setPreset] = useState<Preset>('all');
  const [sortKey, setSortKey] = useState<'change' | 'rsi' | 'close' | 'atr' | 'symbol'>('change');
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
  const [scanned, setScanned] = useState<Row[]>([]);
  const [ran, setRan] = useState(false);

  const universe = useMemo(() => {
    const q = query.trim().toLowerCase();
    return markets.filter((market) => market.kind === 'perp' && (!q || market.symbol.toLowerCase().includes(q)));
  }, [query]);

  const visible = useMemo(() => {
    const q = resultQuery.trim().toLowerCase();
    const rows = scanned.filter((row) => {
      if (q && !row.symbol.toLowerCase().includes(q)) return false;
      if (preset === 'oversold') return row.rsi < 35;
      if (preset === 'overbought') return row.rsi > 65;
      if (preset === 'bull') return row.trend === 'Bullish';
      if (preset === 'bear') return row.trend === 'Bearish';
      if (preset === 'gainers') return row.change > 0;
      if (preset === 'losers') return row.change < 0;
      if (preset === 'favorites') return trade.favorites.some((key) => key.startsWith(`perp:${row.symbol}`));
      return true;
    });
    const sign = direction === 'desc' ? -1 : 1;
    return [...rows].sort((a, b) => {
      if (sortKey === 'symbol') return a.symbol.localeCompare(b.symbol) * sign;
      return (a[sortKey] - b[sortKey]) * sign;
    });
  }, [scanned, resultQuery, preset, trade.favorites, direction, sortKey]);

  function toggle(symbol: string) {
    if (selected.includes(symbol)) {
      setSelected(selected.filter((item) => item !== symbol));
      return;
    }
    if (selected.length >= 15) return;
    setSelected([...selected, symbol]);
  }

  function majors() {
    setSelected(['BTC', 'ETH', 'SOL']);
  }

  function scan() {
    const map: Record<string, string> = { '15m': '15m', '1H': '1H', '4H': '4H', '24H': '24H' };
    setScanned(selected.flatMap((symbol) => {
      const market = markets.find((item) => item.symbol === symbol && item.kind === 'perp');
      if (!market) return [];
      const candles = buildCandles(symbol, market.price, market.change, map[timeframe]);
      const closes = candles.map((bar) => bar.close);
      const atr = candles.slice(-14).reduce((sum, bar) => sum + (bar.high - bar.low), 0) / 14;
      const sma = closes.slice(-12).reduce((sum, value) => sum + value, 0) / 12;
      return [{
        symbol,
        pair: market.pair,
        close: market.price,
        change: ((closes[closes.length - 1] - closes[0]) / closes[0]) * 100,
        rsi: rsi(closes.slice(-15)),
        atr,
        trend: market.price >= sma ? 'Bullish' as const : 'Bearish' as const,
      }];
    }));
    setRan(true);
  }

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-8">
      <h1 className="text-3xl font-semibold">Market Screener</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        Scan perpetual candles, calculate RSI, ATR, and trend alignment in the browser, then filter and rank the results locally. No order is submitted.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="panel p-4"><p className="text-xs text-muted">Markets returned</p><p className="mt-1 text-2xl font-semibold num">{visible.length} / {selected.length}</p></article>
        <article className="panel p-4"><p className="text-xs text-muted">Ready</p><p className="mt-1 text-2xl font-semibold num">{scanned.length}</p><p className="text-xs text-muted">Indicators with available inputs</p></article>
        <article className="panel p-4"><p className="text-xs text-muted">Partial / failed</p><p className="mt-1 text-2xl font-semibold num">0</p></article>
        <article className="panel p-4"><p className="text-xs text-muted">Saved favorites</p><p className="mt-1 text-2xl font-semibold num">{trade.favorites.length}</p><p className="text-xs text-muted">Stored in this browser only</p></article>
      </div>

      <section className="panel mt-4 p-4" aria-label="Choose markets">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mint">01 · Universe</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Choose markets</h2>
          <div className="flex gap-2">
            <button type="button" className="ghost-btn h-8 px-3 text-xs" onClick={() => majors()}>Major markets</button>
            <button type="button" className="ghost-btn h-8 px-3 text-xs" onClick={() => setSelected([])}>Clear selection</button>
            <button type="button" className="mint-btn h-8 px-3 text-xs" disabled={selected.length === 0} onClick={() => scan()}>Run scan</button>
          </div>
        </div>
        <label className="mt-3 flex items-center gap-2">
          <span className="sr-only">Find a perpetual market</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="field h-10 rounded-xl border border-line bg-bg px-3 text-sm" placeholder="Search BTC, ETH, SOL…" />
        </label>
        <div className="mt-3 flex max-h-40 flex-wrap gap-2 overflow-y-auto">
          {universe.map((market) => (
            <button
              key={market.symbol}
              type="button"
              className={`h-8 rounded-full border px-3 text-xs font-semibold ${selected.includes(market.symbol) ? 'border-mint bg-mint/15 text-mint' : 'border-line text-ink'}`}
              aria-pressed={selected.includes(market.symbol)}
              onClick={() => toggle(market.symbol)}
            >
              {market.symbol} Perpetual
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {selected.map((symbol) => (
            <span key={symbol} className="inline-flex h-7 items-center gap-2 rounded-full bg-soft px-3 text-xs font-semibold">
              {symbol}
              <button type="button" aria-label={`Remove ${symbol}`} onClick={() => toggle(symbol)}>×</button>
            </span>
          ))}
          <label className="ms-auto text-sm">
            <span className="sr-only">Candle timeframe</span>
            <select value={timeframe} onChange={(event) => setTimeframe(event.target.value as '15m' | '1H' | '4H' | '24H')} className="field h-9 rounded-xl border border-line bg-bg px-3">
              <option value="15m">15 minutes</option>
              <option value="1H">1 hour</option>
              <option value="4H">4 hours</option>
              <option value="24H">1 day</option>
            </select>
          </label>
        </div>
      </section>

      <section className="panel mt-4 p-4" aria-label="Filter and rank locally">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mint">02 · Results</p>
        <h2 className="mt-2 text-lg font-semibold">Filter &amp; rank locally</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input value={resultQuery} onChange={(event) => setResultQuery(event.target.value)} className="field h-9 w-56 rounded-xl border border-line bg-bg px-3 text-sm" placeholder="Filter current results…" />
          {presets.map((item) => (
            <button
              key={item}
              type="button"
              className={`h-8 rounded-full px-3 text-xs font-semibold capitalize ${preset === item ? 'bg-mint text-mint-ink' : 'bg-soft text-ink'}`}
              onClick={() => setPreset(item)}
            >
              {item === 'bull' ? 'Bullish alignment' : item === 'bear' ? 'Bearish alignment' : item}
            </button>
          ))}
          <select value={sortKey} onChange={(event) => setSortKey(event.target.value as 'change' | 'rsi' | 'close' | 'atr' | 'symbol')} className="field h-9 rounded-xl border border-line bg-bg px-3 text-sm" aria-label="Sort by">
            <option value="change">Window change %</option>
            <option value="rsi">RSI 14</option>
            <option value="close">Last close</option>
            <option value="atr">ATR 14</option>
            <option value="symbol">Symbol</option>
          </select>
          <select value={direction} onChange={(event) => setDirection(event.target.value as 'desc' | 'asc')} className="field h-9 rounded-xl border border-line bg-bg px-3 text-sm" aria-label="Direction">
            <option value="desc">High to low</option>
            <option value="asc">Low to high</option>
          </select>
        </div>

        {!ran ? (
          <p className="mt-8 text-center text-sm text-muted">Choose up to 15 perpetual markets and run a scan. Filtering and indicator math stay in this browser.</p>
        ) : visible.length === 0 ? (
          <p className="mt-8 text-center text-sm text-muted">No rows match the current filter.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-2 py-2 text-start font-medium">Symbol</th>
                  <th className="px-2 py-2 text-end font-medium">Last close</th>
                  <th className="px-2 py-2 text-end font-medium">Window change</th>
                  <th className="px-2 py-2 text-end font-medium">RSI 14</th>
                  <th className="px-2 py-2 text-end font-medium">ATR 14</th>
                  <th className="px-2 py-2 text-end font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <tr key={row.symbol} className="border-t border-line">
                    <td className="px-2 py-3">
                      <Link to={tradePath(row.symbol, 'perp')} className="flex items-center gap-2 font-semibold">
                        <CoinIcon symbol={row.symbol} size={24} />{row.pair}
                      </Link>
                    </td>
                    <td className="px-2 py-3 text-end num">{formatPrice(row.close)}</td>
                    <td className={`px-2 py-3 text-end num ${row.change < 0 ? 'text-ask' : 'text-bid'}`}>{formatSigned(row.change)}</td>
                    <td className={`px-2 py-3 text-end num ${row.rsi < 35 ? 'text-bid' : row.rsi > 65 ? 'text-ask' : ''}`}>{row.rsi.toFixed(1)}</td>
                    <td className="px-2 py-3 text-end num">{formatPrice(row.atr)}</td>
                    <td className={`px-2 py-3 text-end ${row.trend === 'Bullish' ? 'text-bid' : 'text-ask'}`}>{row.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}
