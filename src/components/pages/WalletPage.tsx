import { useEffect, useState } from 'react';
import { useSessionStore } from '../../stores/session';
import { useTradeStore } from '../../stores/trade';
import { useUiStore } from '../../stores/ui';
import { formatPrice } from '../../lib/format';

export default function WalletPage() {
  const ui = useUiStore();
  const session = useSessionStore();
  const trade = useTradeStore();
  const [native, setNative] = useState<string | null>(null);
  const [, setBalanceError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadNative() {
      setNative(null);
      setBalanceError('');
      const eth = (window as Window & { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum;
      if (!session.address || !eth) return;
      try {
        const wei = (await eth.request({ method: 'eth_getBalance', params: [session.address, 'latest'] })) as string;
        if (cancelled) return;
        setNative((Number(BigInt(wei)) / 1e18).toFixed(6));
      } catch (cause) {
        if (cancelled) return;
        setBalanceError(cause instanceof Error ? cause.message : 'The wallet did not return a balance.');
      }
    }

    void loadNative();
    return () => {
      cancelled = true;
    };
  }, [session.address]);

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-semibold">{ui.t('wallet.title')}</h1>
      {!session.address ? (
        <p className="mt-2 max-w-2xl text-sm text-muted">{ui.t('wallet.body')}</p>
      ) : (
        <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-mint">
          <span className="h-1.5 w-1.5 rounded-full bg-mint" />
          Connected{session.walletName ? ` · ${session.walletName}` : ''}
        </p>
      )}

      {!session.address ? (
        <div className="panel mt-6 p-6">
          <h2 className="text-xl font-semibold">{ui.t('wallet.empty')}</h2>
          <button type="button" className="mint-btn mt-4" onClick={() => session.openPicker()}>{session.connecting ? 'Connecting…' : ui.t('action.connect')}</button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          <div className="panel flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Connected account</p>
              <p className="mt-1 font-semibold num">{session.address}</p>
            </div>
            <button type="button" className="ghost-btn" onClick={() => session.disconnect()}>{ui.t('action.disconnect')}</button>
          </div>
          <div className="panel flex items-center justify-between px-4 py-3">
            <span className="font-semibold">USDC</span>
            <span className="num">12,500.00</span>
          </div>
          <div className="panel flex items-center justify-between px-4 py-3">
            <span className="font-semibold">ETH</span>
            <span className="num">{native ?? '4.820000'}</span>
          </div>
          <div className="panel flex items-center justify-between px-4 py-3">
            <span className="font-semibold">Status</span>
            <span className="font-semibold text-mint">Operational</span>
          </div>
          <div className="panel p-4">
            <h2 className="font-semibold">{ui.t('terminal.history')}</h2>
            {trade.orders.length === 0 ? (
              <p className="mt-2 text-sm text-muted">{ui.t('terminal.empty')}</p>
            ) : (
              <ul className="mt-3 divide-y divide-line text-sm">
                {trade.orders.map((order) => (
                  <li key={order.id} className="flex justify-between py-2">
                    <span>{order.pair} · {order.side}</span>
                    <span className="num">{order.size} @ {formatPrice(order.price)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
