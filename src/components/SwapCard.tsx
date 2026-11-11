import { useMemo, useState } from 'react';
import { ArrowDownUp, ChevronDown, RefreshCw, Settings, Wallet } from 'lucide-react';
import CoinIcon from './CoinIcon';
import { markets } from '../data/markets';
import { formatPrice } from '../lib/format';
import { useLiveTick, wobble } from '../lib/live';
import { useSessionStore } from '../stores/session';

function priceOf(symbol: string) {
  if (!symbol || symbol === 'USDC') return 1;
  const found = markets.find((market) => market.symbol === symbol && market.kind === 'spot')
    ?? markets.find((market) => market.symbol === symbol);
  return found ? wobble(found.price, symbol.length) : 1;
}

export default function SwapCard() {
  const session = useSessionStore();
  const tick = useLiveTick();
  const [paySymbol, setPaySymbol] = useState('USDC');
  const [receiveSymbol, setReceiveSymbol] = useState('');
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [marketOpen, setMarketOpen] = useState(false);
  const [assetMenu, setAssetMenu] = useState<'pay' | 'receive' | ''>('');
  const [notice, setNotice] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const tradable = useMemo(() => {
    const seen = new Set<string>();
    return markets.filter((market) => {
      if (market.kind !== 'spot' || market.symbol === 'USDC' || seen.has(market.symbol)) return false;
      seen.add(market.symbol);
      return true;
    });
  }, []);

  const assets = useMemo(() => [{ symbol: 'USDC' }, ...tradable.map((market) => ({ symbol: market.symbol }))], [tradable]);
  const hasMarket = useMemo(() => Boolean(receiveSymbol), [receiveSymbol]);

  const output = useMemo(() => {
    const qty = Number(amount);
    if (!hasMarket || !Number.isFinite(qty) || qty <= 0) return 0;
    return (qty * priceOf(paySymbol)) / priceOf(receiveSymbol);
  }, [amount, hasMarket, paySymbol, receiveSymbol, tick]);

  function chooseMarket(symbol: string) {
    setPaySymbol('USDC');
    setReceiveSymbol(symbol);
    setMarketOpen(false);
    setAssetMenu('');
    setNotice('');
  }

  function toggleAsset(side: 'pay' | 'receive') {
    setMarketOpen(false);
    setAssetMenu(assetMenu === side ? '' : side);
  }

  function chooseAsset(symbol: string) {
    if (assetMenu === 'pay') setPaySymbol(symbol);
    if (assetMenu === 'receive') setReceiveSymbol(symbol);
    setAssetMenu('');
    setNotice('');
  }

  function flip() {
    if (!receiveSymbol || receiveSymbol === paySymbol) return;
    const nextPay = receiveSymbol;
    setReceiveSymbol(paySymbol);
    setPaySymbol(nextPay);
  }

  function refreshQuote() {
    setRefreshing(true);
    setNotice('');
    window.setTimeout(() => {
      setRefreshing(false);
    }, 700);
  }

  function submit() {
    setNotice('');
    if (!session.address) {
      session.openPicker();
      return;
    }
    if (!hasMarket || !output) {
      setNotice('Select a market and enter an amount.');
      return;
    }
    setNotice('Preview only. No swap was sent.');
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[1.65rem] font-semibold tracking-tight">Swap</h2>
        <span className="rounded-full border border-mint/40 px-3 py-1 text-xs font-medium text-mint">Hyperliquid Spot</span>
      </div>

      <section className="rounded-[1.6rem] border border-line bg-elev p-3 sm:p-4">
        <div className="flex items-center gap-2 rounded-full border border-line bg-soft/80 px-2 py-1.5">
          <button
            type="button"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-mint"
            aria-label="Refresh markets"
            onClick={refreshQuote}
          >
            <RefreshCw className={`h-4 w-4${refreshing ? ' animate-spin' : ''}`} />
          </button>
          <div className="relative min-w-0">
            <button
              type="button"
              className="inline-flex max-w-full items-center gap-1 text-sm font-semibold"
              aria-expanded={marketOpen}
              onClick={() => {
                setAssetMenu('');
                setMarketOpen(!marketOpen);
              }}
            >
              <span className="truncate">{hasMarket ? `${receiveSymbol}/${paySymbol}` : 'Select a market'}</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
            </button>
            {marketOpen ? (
              <div className="absolute start-0 top-full z-20 mt-2 max-h-64 w-52 overflow-auto rounded-xl border border-line bg-elev p-1">
                {tradable.map((market) => (
                  <button
                    key={market.symbol}
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm hover:bg-soft"
                    onClick={() => chooseMarket(market.symbol)}
                  >
                    <CoinIcon symbol={market.symbol} size={20} />
                    {market.pair}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <span className="rounded-full bg-mint px-2 py-0.5 text-[10px] font-bold tracking-wide text-mint-ink">SPOT</span>
          <span className="ms-auto inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Syncing
          </span>
          <button type="button" className="grid h-8 w-8 place-items-center rounded-full text-muted" aria-label="Swap settings" onClick={() => setSettingsOpen(!settingsOpen)}>
            <Settings className="h-4 w-4" />
          </button>
        </div>

        {settingsOpen ? (
          <div className="mt-3 rounded-xl bg-soft p-3">
            <p className="text-xs font-semibold text-muted">Slippage</p>
            <div className="mt-2 flex gap-2">
              {[0.1, 0.5, 1].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`rounded-full px-3 py-1 text-xs font-bold ${slippage === value ? 'bg-mint text-mint-ink' : 'bg-bg text-muted'}`}
                  onClick={() => setSlippage(value)}
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-3 rounded-2xl border border-line bg-bg/40 p-3">
          <div className="flex items-start justify-between gap-3 text-sm">
            <span className="font-medium">You pay</span>
            <span className="text-xs text-muted">
              Available{' '}
              {!session.address ? (
                <button type="button" className="font-semibold text-mint" onClick={() => session.openPicker()}>
                  Connect wallet
                </button>
              ) : (
                <span className="font-semibold text-ink">12,500 USDC</span>
              )}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className={`relative${assetMenu === 'pay' ? ' z-30' : ''}`}>
              <button type="button" className="inline-flex h-11 items-center gap-2 rounded-full bg-soft py-1 pe-3 ps-1" aria-expanded={assetMenu === 'pay'} onClick={() => toggleAsset('pay')}>
                <CoinIcon symbol={paySymbol} size={32} />
                <span className="text-start leading-tight">
                  <span className="block text-sm font-semibold">{paySymbol}</span>
                  <span className="block text-[11px] text-muted">Spot asset</span>
                </span>
                <ChevronDown className="h-4 w-4 text-muted" />
              </button>
              {assetMenu === 'pay' ? (
                <div className="absolute start-0 top-full z-30 mt-2 max-h-64 w-52 overflow-auto rounded-xl border border-line bg-elev p-1">
                  {assets.map((asset) => (
                    <button
                      key={`pay-${asset.symbol}`}
                      type="button"
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm hover:bg-soft"
                      onClick={() => chooseAsset(asset.symbol)}
                    >
                      <CoinIcon symbol={asset.symbol} size={20} />
                      {asset.symbol}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="ms-auto text-end">
              <input
                value={amount}
                onChange={(event) => setAmount(event.currentTarget.value)}
                className="field w-28 text-end text-2xl font-semibold num"
                inputMode="decimal"
                placeholder="0.00"
                aria-label="Quantity in base token"
              />
              <p className="text-[11px] text-muted">{session.address ? 'Quantity in base token' : 'Connect to verify balance'}</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 -my-3 flex justify-center">
          <button type="button" className="grid h-9 w-9 place-items-center rounded-full border border-line bg-elev" aria-label="Reverse assets" onClick={flip}>
            <ArrowDownUp className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-2xl border border-line bg-bg/40 p-3">
          <div className="flex items-start justify-between gap-3 text-sm">
            <span className="font-medium">You receive</span>
            <span className="text-xs text-muted">Estimated output</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className={`relative${assetMenu === 'receive' ? ' z-30' : ''}`}>
              <button type="button" className="inline-flex h-11 items-center gap-2 rounded-full bg-soft py-1 pe-3 ps-1" aria-expanded={assetMenu === 'receive'} onClick={() => toggleAsset('receive')}>
                <CoinIcon symbol={receiveSymbol || 'USDC'} size={32} />
                <span className="text-start leading-tight">
                  <span className="block text-sm font-semibold">{receiveSymbol || '—'}</span>
                  <span className="block text-[11px] text-muted">Spot asset</span>
                </span>
                <ChevronDown className="h-4 w-4 text-muted" />
              </button>
              {assetMenu === 'receive' ? (
                <div className="absolute start-0 top-full z-30 mt-2 max-h-64 w-52 overflow-auto rounded-xl border border-line bg-elev p-1">
                  {assets.map((asset) => (
                    <button
                      key={`receive-${asset.symbol}`}
                      type="button"
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm hover:bg-soft"
                      onClick={() => chooseAsset(asset.symbol)}
                    >
                      <CoinIcon symbol={asset.symbol} size={20} />
                      {asset.symbol}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="ms-auto text-end">
              <p className="text-2xl font-semibold num">{output ? formatPrice(output) : '—'}</p>
              <p className="text-[11px] text-muted">{output ? 'Actual fill can differ' : 'Awaiting executable quote'}</p>
            </div>
          </div>
        </div>

        <button type="button" className="mint-btn btn-square mt-3 h-12 w-full text-base" onClick={submit}>
          <Wallet className="h-4 w-4" />
          {session.address ? 'Preview swap' : 'Connect wallet'}
        </button>
        <button type="button" className="mt-2 w-full py-2 text-center text-sm text-muted" onClick={refreshQuote}>Refresh quote</button>
        {notice ? <p className="mt-2 text-center text-sm text-mint">{notice}</p> : null}
        <p className="mt-1 text-center text-[11px] text-muted">Fees follow your Hyperliquid fee tier. Partial fills are possible.</p>
      </section>
    </div>
  );
}
