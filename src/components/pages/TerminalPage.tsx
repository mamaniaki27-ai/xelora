import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FavoriteStar from '../FavoriteStar';
import CandleChart from '../CandleChart';
import CoinIcon from '../CoinIcon';
import { marketKey, markets, type Market } from '../../data/markets';
import { buildCandles } from '../../lib/candles';
import { changeClass, formatCompact, formatPrice, formatSigned } from '../../lib/format';
import { useLiveTick, wobble } from '../../lib/live';
import { parseTradePath, tradePath } from '../../lib/pairs';
import { useSessionStore } from '../../stores/session';
import { useTradeStore } from '../../stores/trade';
import { useUiStore } from '../../stores/ui';

function bookStep(price: number) {
  if (price >= 1000) return Math.max(1, Math.round(price * 0.00008));
  if (price >= 100) return price * 0.00015;
  if (price >= 1) return price * 0.0004;
  if (price >= 0.01) return price * 0.0008;
  return price * 0.0015;
}

function bookSize(seed: number, price: number) {
  const unit = price >= 1000 ? 0.00014 : price >= 1 ? 0.02 : 8;
  const bump = seed % 7 === 0 ? unit * 180 : unit * (1 + (seed % 9));
  return bump;
}

function bookPrice(value: number) {
  if (value >= 100) return value.toLocaleString('en-US', { maximumFractionDigits: value >= 1000 ? 0 : 2 });
  return formatPrice(value);
}

function bookSizeText(value: number) {
  if (value >= 1) return value.toFixed(3);
  if (value >= 0.01) return value.toFixed(5).replace(/0+$/, '').replace(/\.$/, '');
  return value.toFixed(5);
}

const intervals = ['1m', '5m', '15m', '30m', '1H', '4H', '24H'];

export default function TerminalPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const ui = useUiStore();
  const session = useSessionStore();
  const trade = useTradeStore();
  const tick = useLiveTick();

  const [side, setSide] = useState<'long' | 'short'>('long');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('market');
  const [size, setSize] = useState('');
  const [leverage, setLeverage] = useState(10);
  const [takeProfit, setTakeProfit] = useState(false);
  const [reduceOnly, setReduceOnly] = useState(false);
  const [message, setMessage] = useState('');
  const [bookTab, setBookTab] = useState<'book' | 'trades'>('book');
  const [bottomTab, setBottomTab] = useState<'positions' | 'history'>('positions');
  const [interval, setChartInterval] = useState('1H');
  const [limitPrice, setLimitPrice] = useState<number | string>(0);

  const kind = useMemo(() => {
    const parsed = parseTradePath(location.pathname);
    if (parsed) return parsed.kind;
    return location.pathname.startsWith('/spot') ? 'spot' : 'perp';
  }, [location.pathname]);

  const universe = useMemo(
    () => markets.filter((market) => market.kind === (kind === 'perp' ? 'perp' : 'spot')),
    [kind],
  );

  const selected = useMemo<Market>(() => {
    const parsed = parseTradePath(location.pathname);
    const found = parsed && universe.find((market) => market.symbol === parsed.symbol);
    return found || universe[0];
  }, [location.pathname, universe]);

  const livePrice = useMemo(() => {
    return wobble(selected.price, selected.symbol.length);
  }, [tick, selected]);

  useEffect(() => {
    setLimitPrice((current) => {
      if (orderType === 'market' || current === 0) {
        return Number(livePrice.toFixed(livePrice >= 100 ? 2 : 4));
      }
      return current;
    });
  }, [livePrice, orderType]);

  const entry = useMemo(
    () => (orderType === 'market' ? livePrice : Number(limitPrice) || livePrice),
    [orderType, livePrice, limitPrice],
  );
  const sizeNum = useMemo(() => Number(size) || 0, [size]);
  const value = useMemo(() => sizeNum * entry, [sizeNum, entry]);
  const margin = useMemo(() => (kind === 'perp' ? value / leverage : value), [kind, value, leverage]);
  const liq = useMemo(() => {
    if (kind !== 'perp' || !sizeNum) return 0;
    const move = entry / leverage * 0.9;
    return side === 'long' ? entry - move : entry + move;
  }, [kind, sizeNum, entry, leverage, side]);

  const candles = useMemo(
    () => buildCandles(selected.symbol, selected.price, selected.change, interval),
    [selected, interval],
  );

  const book = useMemo(() => {
    const mid = livePrice;
    const step = bookStep(mid);
    const asksNear = Array.from({ length: 10 }, (_, index) => ({
      price: mid + step * (index + 1),
      size: bookSize(index + 3, mid),
      total: 0,
    })).sort((a, b) => a.price - b.price);
    let askTotal = 0;
    for (const level of asksNear) {
      askTotal += level.price * level.size;
      level.total = askTotal;
    }
    const bids = Array.from({ length: 10 }, (_, index) => ({
      price: Math.max(mid - step * (index + 1), mid * 0.2),
      size: bookSize(index + 5, mid),
      total: 0,
    })).sort((a, b) => b.price - a.price);
    let bidTotal = 0;
    for (const level of bids) {
      bidTotal += level.price * level.size;
      level.total = bidTotal;
    }
    const asks = [...asksNear].reverse();
    const bestAsk = asksNear[0].price;
    const bestBid = bids[0].price;
    const spread = bestAsk - bestBid;
    const askSize = asks.reduce((sum, level) => sum + level.size, 0);
    const bidSize = bids.reduce((sum, level) => sum + level.size, 0);
    const maxSize = Math.max(...asks.map((level) => level.size), ...bids.map((level) => level.size));
    return {
      asks,
      bids,
      spread,
      spreadPct: mid > 0 ? (spread / mid) * 100 : 0,
      maxSize,
      buyPct: ((bidSize / (bidSize + askSize)) * 100) || 50,
      sellPct: ((askSize / (bidSize + askSize)) * 100) || 50,
      mark: mid,
    };
  }, [livePrice]);

  const prints = useMemo(
    () => book.bids.slice(0, 8).map((level, index) => ({
      price: index % 2 === 0 ? level.price : book.asks[index].price,
      size: level.size,
      side: index % 2 === 0 ? 'buy' : 'sell',
    })),
    [book],
  );

  const pairOrders = useMemo(
    () => trade.orders.filter((order) => order.pair === selected.pair),
    [trade.orders, selected.pair],
  );

  function choosePair(symbol: string) {
    navigate(tradePath(symbol, kind === 'perp' ? 'perp' : 'spot'));
  }

  function fillPercent(percent: number) {
    const balance = 12500;
    const notional = kind === 'perp' ? balance * leverage * (percent / 100) : balance * (percent / 100);
    setSize((notional / entry).toFixed(selected.price >= 1000 ? 4 : 3));
  }

  function submit() {
    setMessage('');
    if (!session.address) {
      setMessage(ui.t('terminal.needWallet'));
      session.openPicker();
      return;
    }
    if (!sizeNum) {
      setMessage(ui.t('terminal.needSize'));
      return;
    }
    const label = kind === 'perp'
      ? (side === 'long' ? ui.t('terminal.long') : ui.t('terminal.short'))
      : (side === 'long' ? ui.t('terminal.buy') : ui.t('terminal.sell'));
    trade.addOrder({
      pair: selected.pair,
      side: label,
      orderType,
      price: entry,
      size: sizeNum,
      leverage: kind === 'perp' ? leverage : 1,
    });
    setSize('');
    setBottomTab('positions');
    setMessage(ui.locale === 'fa' ? 'سفارش نمونه در همین مرورگر ثبت شد.' : 'Preview order stored in this browser.');
  }

  return (
    <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-3 py-3 lg:h-[calc(100dvh-4rem)]">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
          XELORA · {kind === 'perp' ? ui.t('terminal.futures') : ui.t('terminal.spot')}
        </p>
        <p className="ms-auto text-xs font-semibold text-muted">
          {session.address ? session.shortAddress : ui.t('terminal.notConnected')}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          <CoinIcon symbol={selected.symbol} size={28} />
          <span className="sr-only">Market</span>
          <select className="rounded-lg bg-soft px-2 py-1 text-sm font-bold" value={selected.symbol} onChange={(event) => choosePair(event.target.value)}>
            {universe.map((market) => (
              <option key={market.pair} value={market.symbol}>{market.pair}</option>
            ))}
          </select>
        </label>
        <FavoriteStar id={marketKey(selected)} />
        <p className="text-2xl font-semibold num">{formatPrice(livePrice)}</p>
        <p className={`text-sm font-semibold num ${changeClass(selected.change)}`}>{formatSigned(selected.change)}</p>
        <dl className="flex flex-wrap gap-4 text-xs text-muted">
          <div><dt>24h high</dt><dd className="font-semibold text-ink num">{formatPrice(livePrice * 1.012)}</dd></div>
          <div><dt>24h low</dt><dd className="font-semibold text-ink num">{formatPrice(livePrice * 0.988)}</dd></div>
          <div><dt>Volume</dt><dd className="font-semibold text-ink num">{formatCompact(selected.volume)}</dd></div>
          {selected.funding !== undefined ? <div><dt>Funding</dt><dd className="font-semibold text-ink num">{selected.funding.toFixed(4)}%</dd></div> : null}
        </dl>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1fr)_260px_280px]">
        <div className="panel flex min-h-[320px] flex-col p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-mint px-2 py-1 text-xs font-bold text-mint-ink">{ui.t('terminal.pro')}</span>
            {intervals.map((item) => (
              <button
                key={item}
                type="button"
                className={`inline-flex h-7 min-w-9 items-center justify-center rounded-md px-2 text-xs font-semibold ${interval === item ? 'bg-soft text-ink' : 'text-muted'}`}
                onClick={() => setChartInterval(item)}
              >
                {item}
              </button>
            ))}
            <span className="ms-auto text-[11px] font-semibold text-[#e0b84d]">MA 12</span>
          </div>
          <CandleChart className="mt-2" candles={candles} interval={interval} mark={livePrice} />
        </div>

        <div className="panel flex min-h-[280px] flex-col overflow-hidden p-0">
          <div className="grid grid-cols-2 border-b border-line text-center text-[11px] font-bold uppercase tracking-[0.08em]">
            <button type="button" className={`py-2.5 ${bookTab === 'book' ? 'border-b-2 border-mint text-ink' : 'text-muted'}`} onClick={() => setBookTab('book')}>Order book</button>
            <button type="button" className={`py-2.5 ${bookTab === 'trades' ? 'border-b-2 border-mint text-ink' : 'text-muted'}`} onClick={() => setBookTab('trades')}>Trades</button>
          </div>
          {bookTab === 'book' ? (
            <>
              <div className="mx-3 mt-2 flex h-1 overflow-hidden rounded-sm bg-ask">
                <div className="h-full bg-bid" style={{ width: `${book.buyPct}%` }} />
              </div>
              <div className="flex justify-between px-3 py-1 text-[10px] font-semibold">
                <span className="text-bid">{book.buyPct.toFixed(1)}% Buy</span>
                <span className="text-ask">{book.sellPct.toFixed(1)}% Sell</span>
              </div>
              <div className="grid grid-cols-3 px-3 pb-1 text-[9px] font-bold uppercase tracking-wide text-muted">
                <span>Price</span>
                <span className="text-end">Size ({selected.symbol})</span>
                <span className="text-end">Total (USDC)</span>
              </div>
              <div className="num text-[11px] leading-5">
                {book.asks.map((level) => (
                  <div key={`a${level.price}`} className="relative grid grid-cols-3 px-3">
                    <span className="absolute inset-y-0 end-0 bg-ask/20" style={{ width: `${(level.size / book.maxSize) * 100}%` }} />
                    <span className="relative text-ask">{bookPrice(level.price)}</span>
                    <span className="relative text-end text-ink">{bookSizeText(level.size)}</span>
                    <span className="relative text-end text-muted">{formatPrice(level.total)}</span>
                  </div>
                ))}
                <div className="my-1 grid grid-cols-[1fr_auto] items-center gap-2 border-y border-line px-3 py-1">
                  <span className="text-sm font-bold text-bid">↑ {bookPrice(book.mark)}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">Spread {bookPrice(book.spread)} ({book.spreadPct.toFixed(3)}%)</span>
                </div>
                {book.bids.map((level) => (
                  <div key={`b${level.price}`} className="relative grid grid-cols-3 px-3">
                    <span className="absolute inset-y-0 end-0 bg-bid/20" style={{ width: `${(level.size / book.maxSize) * 100}%` }} />
                    <span className="relative text-bid">{bookPrice(level.price)}</span>
                    <span className="relative text-end text-ink">{bookSizeText(level.size)}</span>
                    <span className="relative text-end text-muted">{formatPrice(level.total)}</span>
                  </div>
                ))}
              </div>
              <p className="mt-auto px-3 py-2 text-[10px] text-muted">{book.asks.length} asks · {book.bids.length} bids</p>
            </>
          ) : (
            <ul className="space-y-1 px-3 py-3 text-xs">
              <li className="grid grid-cols-3 text-[9px] font-bold uppercase tracking-wide text-muted">
                <span>Price</span><span className="text-end">Size</span><span className="text-end">Side</span>
              </li>
              {prints.map((print, index) => (
                <li key={index} className="grid grid-cols-3 num">
                  <span className={print.side === 'buy' ? 'text-bid' : 'text-ask'}>{bookPrice(print.price)}</span>
                  <span className="text-end">{bookSizeText(print.size)}</span>
                  <span className={`text-end uppercase ${print.side === 'buy' ? 'text-bid' : 'text-ask'}`}>{print.side}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form
          className="panel flex flex-col gap-3 p-3"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <h2 className="text-sm font-semibold">{ui.t('terminal.place')}</h2>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className={`rounded-xl py-2 text-sm font-bold ${side === 'long' ? 'bg-mint text-mint-ink' : 'bg-soft text-muted'}`} onClick={() => setSide('long')}>
              {kind === 'perp' ? ui.t('terminal.long') : ui.t('terminal.buy')}
            </button>
            <button type="button" className={`rounded-xl py-2 text-sm font-bold ${side === 'short' ? 'bg-ask text-white' : 'bg-soft text-muted'}`} onClick={() => setSide('short')}>
              {kind === 'perp' ? ui.t('terminal.short') : ui.t('terminal.sell')}
            </button>
          </div>
          <div className="flex gap-3 text-sm font-semibold">
            <button type="button" className={orderType === 'limit' ? 'text-ink' : 'text-muted'} onClick={() => setOrderType('limit')}>{ui.t('terminal.limit')}</button>
            <button type="button" className={orderType === 'market' ? 'text-mint' : 'text-muted'} onClick={() => setOrderType('market')}>{ui.t('terminal.market')}</button>
            {kind === 'perp' ? <span className="ms-auto text-xs text-muted">{ui.t('terminal.cross')}</span> : null}
          </div>
          {orderType === 'limit' ? (
            <label className="block text-xs text-muted">
              {ui.t('terminal.price')}
              <input
                value={limitPrice}
                onChange={(event) => {
                  const raw = event.target.value;
                  const parsed = parseFloat(raw);
                  setLimitPrice(Number.isNaN(parsed) ? raw : parsed);
                }}
                className="field mt-1 rounded-xl bg-soft px-3 py-2 text-base font-semibold text-ink num"
                inputMode="decimal"
              />
            </label>
          ) : null}
          <label className="block text-xs text-muted">
            {ui.t('terminal.size')} · {selected.symbol}
            <input value={size} onChange={(event) => setSize(event.target.value)} className="field mt-1 rounded-xl bg-soft px-3 py-2 text-base font-semibold text-ink num" inputMode="decimal" placeholder="0.00" />
          </label>
          <div className="grid grid-cols-5 gap-1">
            {[10, 25, 50, 75, 100].map((percent) => (
              <button key={percent} type="button" className="rounded-lg bg-soft py-1 text-[11px] font-bold" onClick={() => fillPercent(percent)}>
                {percent}%
              </button>
            ))}
          </div>
          {kind === 'perp' ? (
            <div>
              <div className="flex justify-between text-xs text-muted">
                <span>{ui.t('terminal.leverage')}</span>
                <span className="text-ink">{leverage}×</span>
              </div>
              <input value={leverage} onChange={(event) => setLeverage(Number(event.target.value))} className="mt-2 w-full accent-[var(--mint)]" type="range" min={1} max={selected.maxLeverage} step={1} />
            </div>
          ) : null}
          {kind === 'perp' ? (
            <label className="flex items-center gap-2 text-xs text-muted">
              <input checked={takeProfit} onChange={(event) => setTakeProfit(event.target.checked)} type="checkbox" /> {ui.t('terminal.tp')}
            </label>
          ) : null}
          {kind === 'perp' ? (
            <label className="flex items-center gap-2 text-xs text-muted">
              <input checked={reduceOnly} onChange={(event) => setReduceOnly(event.target.checked)} type="checkbox" /> {ui.t('terminal.reduce')}
            </label>
          ) : null}
          <dl className="space-y-1 text-xs text-muted">
            <div className="flex justify-between"><dt>{ui.t('terminal.value')}</dt><dd className="text-ink num">{formatPrice(value)} USDC</dd></div>
            <div className="flex justify-between"><dt>{ui.t('terminal.margin')}</dt><dd className="text-ink num">{formatPrice(margin)} USDC</dd></div>
            {kind === 'perp' ? <div className="flex justify-between"><dt>{ui.t('terminal.liq')}</dt><dd className="text-ink num">{liq ? formatPrice(liq) : '—'}</dd></div> : null}
          </dl>
          <button type="submit" className="mint-btn h-11 w-full">{session.address ? ui.t('terminal.submit') : ui.t('action.connect')}</button>
          {message ? <p className="text-xs text-mint">{message}</p> : null}
        </form>
      </div>

      <div className="panel p-3">
        <div className="flex gap-4 text-sm font-semibold">
          <button type="button" className={bottomTab === 'positions' ? 'text-ink' : 'text-muted'} onClick={() => setBottomTab('positions')}>
            {ui.t('terminal.positions')} {pairOrders.length}
          </button>
          <button type="button" className={bottomTab === 'history' ? 'text-ink' : 'text-muted'} onClick={() => setBottomTab('history')}>{ui.t('terminal.history')}</button>
        </div>
        {pairOrders.length === 0 ? (
          <p className="py-6 text-sm text-muted">
            {ui.t('terminal.empty')}. {ui.t('terminal.emptyHint')}
          </p>
        ) : (
          <table className="mt-3 w-full text-sm">
            <thead className="text-xs text-muted">
              <tr>
                <th className="py-1 text-start font-medium">Side</th>
                <th className="py-1 text-end font-medium">Size</th>
                <th className="py-1 text-end font-medium">Price</th>
                <th className="py-1 text-end font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {pairOrders.map((order) => (
                <tr key={order.id} className="border-t border-line">
                  <td className="py-2">{order.side}</td>
                  <td className="py-2 text-end num">{order.size}</td>
                  <td className="py-2 text-end num">{formatPrice(order.price)}</td>
                  <td className="py-2 text-end">{order.orderType}{order.leverage > 1 ? <span> · {order.leverage}×</span> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
