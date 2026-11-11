import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Search, Wallet, X } from 'lucide-react';
import WalletIcon from './WalletIcon';
import { useSessionStore } from '../../stores/session';
import walletDirectory from '../../data/wallet-directory.json';

type WalletDef = {
  id: string;
  name: string;
  href: string;
  image?: string;
  badge?: 'qr' | 'installed';
};

const catalog = walletDirectory as WalletDef[];

function listed(name: string, badge?: WalletDef['badge']): WalletDef {
  const found = catalog.find((wallet) => wallet.name.toLowerCase() === name.toLowerCase());
  return {
    id: found?.id ?? name,
    name,
    href: found?.href || 'https://walletconnect.com/',
    image: found?.image,
    badge,
  };
}

const featured: WalletDef[] = [
  { id: 'walletconnect', name: 'WalletConnect', href: 'https://walletconnect.com/', badge: 'qr' },
  listed('MetaMask', 'installed'),
  listed('Phantom', 'installed'),
  listed('My Wallet'),
  listed('Trust Wallet'),
];

export default function ConnectModal() {
  const session = useSessionStore();
  const [query, setQuery] = useState('');
  const [directoryQuery, setDirectoryQuery] = useState('');
  const [view, setView] = useState<'list' | 'all'>('list');
  const [certifiedOnly, setCertifiedOnly] = useState(true);
  const [pageError, setPageError] = useState('');

  const showPicker = useMemo(() => session.pickerOpen || (session.modalOpen && !session.gateOpen), [session.pickerOpen, session.modalOpen, session.gateOpen]);
  const showOverlay = useMemo(() => session.gateOpen || session.pickerOpen || session.modalOpen, [session.gateOpen, session.pickerOpen, session.modalOpen]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return featured;
    return featured.filter((wallet) => wallet.name.toLowerCase().includes(term));
  }, [query]);

  const visibleDirectory = useMemo(() => {
    const term = directoryQuery.trim().toLowerCase();
    if (!term) return catalog;
    return catalog.filter((wallet) => wallet.name.toLowerCase().includes(term));
  }, [directoryQuery]);

  function dismissPicker() {
    session.closePicker();
    session.closeModal();
  }

  function closeAll() {
    setView('list');
    setPageError('');
    session.setError('');
    if (session.gateOpen) dismissPicker();
    else session.closeGate();
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      if (view === 'all') {
        setView('list');
        return;
      }
      if (session.pickerOpen) {
        session.closePicker();
        session.closeModal();
      } else {
        session.closeGate();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, session]);

  function choose(wallet: WalletDef) {
    if (session.connecting) return;
    window.open(wallet.href, '_blank', 'noopener,noreferrer');
    const message = `${wallet.name} could not complete the connection.`;
    setPageError(message);
    session.setError(message);
  }

  if (!showOverlay) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 grid place-items-center px-4">
        <div className={`absolute inset-0 ${showPicker ? 'bg-black/45 backdrop-blur-md' : 'bg-[#050807]'}`} />
        {!showPicker ? <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,203,129,0.18),transparent_55%)]" /> : null}

        {!showPicker ? (
          <section className="relative w-full max-w-[420px] rounded-2xl border border-white/10 bg-[#14181c] px-8 py-9 text-center shadow-2xl" role="dialog" aria-modal="true" aria-label="Connect your wallet">
            <button type="button" className="text-xs text-muted hover:text-ink" onClick={() => session.closeGate()}>
              ← Back to XELORA
            </button>
            <div className="mx-auto mt-6 grid h-14 w-14 place-items-center rounded-2xl border border-mint/40 text-mint">
              <Wallet className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-semibold">Connect your wallet</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Connect to review your Hyperliquid balances, positions and account activity. Available actions depend on your network and account mode.
            </p>
            <button type="button" className="mint-btn btn-square mt-6 h-12 w-full text-base" onClick={() => session.openPicker()}>
              Connect Wallet
            </button>
            <p className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" />
              Wallet connection required to view account data
            </p>
          </section>
        ) : view === 'list' ? (
          <section className="relative z-10 w-full max-w-[380px] rounded-2xl border border-white/10 bg-[#1c2127] p-4 shadow-2xl" role="dialog" aria-modal="true" aria-label="Connect Wallet">
            <div className="flex items-center gap-2 px-1 pb-3">
              <span className="grid h-6 w-6 place-items-center rounded-full border border-line text-muted">
                <Wallet className="h-3.5 w-3.5" />
              </span>
              <h2 className="flex-1 text-center text-sm font-semibold">Connect Wallet</h2>
              <button type="button" className="grid h-7 w-7 place-items-center rounded-md text-muted hover:text-ink" aria-label="Close" onClick={closeAll}>
                <X className="h-4 w-4" />
              </button>
            </div>

            {pageError ? (
              <p role="alert" className="mb-2 rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                {pageError}
              </p>
            ) : null}

            <ul className="space-y-1">
              {visible.map((wallet) => (
                <li key={wallet.id}>
                  <button type="button" className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-start hover:bg-white/5" onClick={() => choose(wallet)}>
                    <WalletIcon id={wallet.id} src={wallet.image} size={40} />
                    <span className="text-sm font-semibold">{wallet.name}</span>
                    {wallet.badge === 'qr' ? (
                      <span className="ms-auto rounded-md bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-300">QR code</span>
                    ) : wallet.badge === 'installed' ? (
                      <span className="ms-auto text-[10px] font-bold uppercase tracking-wide text-mint">Installed</span>
                    ) : null}
                    <ChevronRight className={`h-4 w-4 text-muted${wallet.badge ? '' : ' ms-auto'}`} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex items-center gap-2 rounded-xl border border-line bg-black/30 px-3 py-2.5 text-sm text-muted">
              <Search className="h-4 w-4 shrink-0" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="field" placeholder="Search Wallet" aria-label="Search Wallet" />
              <button type="button" className="inline-flex items-center gap-1 rounded-md px-1 text-[11px] font-semibold text-muted hover:text-ink" aria-label="All wallets" onClick={() => setView('all')}>
                {catalog.length}
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-3 text-center text-[11px] text-muted">UX by reown</p>
          </section>
        ) : (
          <section className="relative z-10 w-full max-w-[420px] rounded-2xl border border-white/10 bg-[#1c2127] p-4 shadow-2xl" role="dialog" aria-modal="true" aria-label="All Wallets">
            <div className="flex items-center gap-2 px-1 pb-3">
              <button type="button" className="grid h-7 w-7 place-items-center rounded-md text-muted hover:text-ink" aria-label="Back" onClick={() => setView('list')}>
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h2 className="flex-1 text-center text-sm font-semibold">All Wallets</h2>
              <button type="button" className="grid h-7 w-7 place-items-center rounded-md text-muted hover:text-ink" aria-label="Close" onClick={closeAll}>
                <X className="h-4 w-4" />
              </button>
            </div>
            {pageError ? (
              <p role="alert" className="mb-2 rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                {pageError}
              </p>
            ) : null}
            <div className="flex items-center gap-2">
              <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-line bg-black/30 px-3 py-2 text-sm text-muted">
                <Search className="h-4 w-4 shrink-0" />
                <input value={directoryQuery} onChange={(event) => setDirectoryQuery(event.target.value)} className="field" placeholder="Search wallet" aria-label="Search wallet" />
              </label>
              <button
                type="button"
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${certifiedOnly ? 'bg-sky-500' : 'bg-white/15'}`}
                aria-pressed={certifiedOnly}
                aria-label="WalletConnect wallets"
                onClick={() => setCertifiedOnly((current) => !current)}
              >
                <span className={`absolute top-0.5 grid h-6 w-6 place-items-center rounded-full bg-white text-[10px] font-bold text-sky-600 transition ${certifiedOnly ? 'start-5' : 'start-0.5'}`}>W</span>
              </button>
            </div>
            <p className="mt-2 text-[11px] text-muted">{visibleDirectory.length} wallets</p>
            <div className="mt-2 grid max-h-[min(70vh,640px)] grid-cols-3 gap-1 overflow-y-auto pe-1">
              {visibleDirectory.map((wallet) => (
                <button key={wallet.id} type="button" className="flex flex-col items-center gap-2 rounded-xl px-2 py-3 text-center hover:bg-white/5" onClick={() => choose(wallet)}>
                  <span className="relative">
                    <WalletIcon id={wallet.id} src={wallet.image} size={56} />
                    <ArrowUpRight className="absolute -bottom-1 -end-1 h-3.5 w-3.5 rounded-full bg-[#1c2127] text-muted" />
                  </span>
                  <span className="max-w-full truncate text-xs font-medium">{wallet.name}</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
      {pageError ? (
        <p role="alert" className="fixed start-1/2 top-4 z-[80] w-[min(100%-2rem,420px)] -translate-x-1/2 rounded-xl border border-rose-400/50 bg-[#2a1216] px-4 py-3 text-center text-sm text-rose-100 shadow-lg">
          {pageError}
        </p>
      ) : null}
    </>
  );
}
