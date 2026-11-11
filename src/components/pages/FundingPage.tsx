import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import CoinIcon from '../CoinIcon';
import { markets } from '../../data/markets';
import { formatPrice, formatSigned } from '../../lib/format';
import { tradePath } from '../../lib/pairs';
import { useSessionStore } from '../../stores/session';
import { useTradeStore, type PreviewOrder } from '../../stores/trade';

function distance(entry: number, leverage: number) {
  const maintenance = 0.005;
  return Math.max(0, (1 / leverage - maintenance) * 100);
}

export default function FundingPage() {
  const session = useSessionStore();
  const trade = useTradeStore();
  const [captured, setCaptured] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);

  const rows = useMemo(
    () =>
      markets
        .filter((market) => market.kind === 'perp' && typeof market.funding === 'number')
        .map((market) => ({ ...market, hourly: (market.funding ?? 0) / 8 }))
        .sort((a, b) => Math.abs(b.hourly) - Math.abs(a.hourly)),
    [],
  );

  function refresh() {
    setSpinning(true);
    setCaptured(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    window.setTimeout(() => {
      setSpinning(false);
    }, 500);
  }

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint">A2 · Read-only risk data</p>
          <h1 className="mt-2 text-3xl font-semibold">Funding & Liquidation Radar</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            Published perpetual markets only. The funding field is the reported hourly rate, not APR and not a prediction. An 8-hour formula is divided by eight for the hourly display.
          </p>
        </div>
        <button type="button" className="icon-btn inline-grid" aria-label="Refresh data" onClick={refresh}>
          <RefreshCw className={`h-4 w-4${spinning ? ' animate-spin' : ''}`} />
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <article className="panel p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Public funding context</p>
          <p className="mt-2 text-sm">Captured: {captured ?? 'not captured'}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Wallet position snapshot</p>
          <p className="mt-2 text-sm">Captured: {session.address && trade.orders.length ? (captured ?? 'this session') : 'not captured'}</p>
        </article>
      </div>

      <section className="panel mt-4 p-4" aria-label="Open positions">
        <h2 className="text-lg font-semibold">Open positions · reported liquidation distance</h2>
        <p className="mt-1 text-sm text-muted">Connect a wallet to view account positions. Read-only. This page does not ask for or store wallet secrets.</p>
        {!session.address ? <p className="mt-4 text-sm">No wallet is connected.</p> : null}
        {!session.address ? (
          <button type="button" className="mint-btn mt-3 h-10" onClick={() => session.openPicker()}>Connect wallet</button>
        ) : trade.orders.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{session.shortAddress} has no preview positions in this session.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-2 py-2 text-start font-medium">Position</th>
                  <th className="px-2 py-2 text-end font-medium">Entry</th>
                  <th className="px-2 py-2 text-end font-medium">Size</th>
                  <th className="px-2 py-2 text-end font-medium">Liq. distance</th>
                </tr>
              </thead>
              <tbody>
                {trade.orders.map((order: PreviewOrder) => {
                  const liq = distance(order.price, order.leverage);
                  return (
                    <tr key={order.id} className="border-t border-line">
                      <td className="px-2 py-3 font-semibold">{order.pair} · {order.side}</td>
                      <td className="px-2 py-3 text-end num">{formatPrice(order.price)}</td>
                      <td className="px-2 py-3 text-end num">{order.size}</td>
                      <td className={`px-2 py-3 text-end num ${liq < 5 ? 'text-ask' : 'text-ink'}`}>
                        {liq.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel mt-4 p-4" aria-label="Highest absolute current hourly funding rates">
        <h2 className="text-lg font-semibold">Highest absolute current hourly funding rates</h2>
        <p className="mt-1 text-sm text-muted">Reported interval rate, percent per hour. No 24-hour or annualized projection is inferred.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-2 py-2 text-start font-medium">Market</th>
                <th className="px-2 py-2 text-end font-medium">Mark</th>
                <th className="px-2 py-2 text-end font-medium">Hourly</th>
                <th className="px-2 py-2 text-end font-medium">8h reported</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((market) => (
                <tr key={market.pair} className="border-t border-line">
                  <td className="px-2 py-3">
                    <Link to={tradePath(market.symbol, 'perp')} className="flex items-center gap-2 font-semibold">
                      <CoinIcon symbol={market.symbol} size={24} />
                      {market.pair}
                    </Link>
                  </td>
                  <td className="px-2 py-3 text-end num">{formatPrice(market.price)}</td>
                  <td className={`px-2 py-3 text-end num ${market.hourly < 0 ? 'text-ask' : 'text-bid'}`}>{formatSigned(market.hourly)}</td>
                  <td className="px-2 py-3 text-end num">{formatSigned(market.funding ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">
          The 5% liquidation-distance message is only a conservative display warning around a reported level. It is not a liquidation prediction.
        </p>
      </section>
    </section>
  );
}
