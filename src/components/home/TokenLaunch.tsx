import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Droplets, Lock, Shield, X } from 'lucide-react';
import LogoMark from '../shell/LogoMark';

const storageKey = 'xelora-xco-waitlist';

const allocation = [
  { label: 'Ecosystem Rewards', pct: 40, color: '#0ecb81' },
  { label: 'Treasury (DAO)', pct: 20, color: '#14b8a6' },
  { label: 'Team & Advisors', pct: 15, color: '#2dd4bf' },
  { label: 'Liquidity Provision', pct: 10, color: '#34d399' },
  { label: 'Development & Marketing', pct: 7, color: '#5eead4' },
  { label: 'Community Airdrop', pct: 5, color: '#86efac' },
  { label: 'Founder & Early Contributor', pct: 3, color: '#a7f3d0' },
];

const phases = [
  { phase: 'Phase 1', title: 'Wallet, Swap & Landing', status: 'Completed', tone: 'done' },
  { phase: 'Phase 2', title: 'Xelo Token Launch', status: 'In progress', tone: 'active' },
  { phase: 'Phase 3', title: 'Earn & Governance', status: 'Planned', tone: 'planned' },
];

const assurances = [
  { icon: Lock, title: 'Multisig Treasury', body: 'Treasury will be secured via MultiSig + Timelock after deployment.' },
  { icon: Shield, title: 'Security Review', body: 'Independent security review planned before any public deployment.' },
  { icon: Droplets, title: 'Liquidity Lock', body: 'Initial liquidity will be locked with a public, verifiable lock after launch.' },
];

function jump(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function TokenLaunch() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setJoined(Boolean(localStorage.getItem(storageKey)));
  }, []);

  function submitWaitlist() {
    const next = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next)) {
      setError('Enter a valid email address.');
      return;
    }
    localStorage.setItem(storageKey, next);
    setJoined(true);
    setError('');
    setOpen(false);
  }

  return (
    <section id="xco-token" className="mx-auto w-full max-w-[1100px] px-4 py-6 pb-16">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-mint/30 bg-[#070b09] px-5 py-8 text-white shadow-[0_0_90px_rgba(14,203,129,0.09)] sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute -end-24 -top-24 h-64 w-64 rounded-full bg-mint/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-mint/40 bg-mint/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-mint">
                <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                Xelo token — pre-launch
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-mint">Ecosystem governance</span>
            </div>
            <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
              Xelo Token — Pre-launch Information
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60">
              Xelo Token is marked pre-launch. Token utility, incentives and availability remain unconfirmed until the relevant token documentation is published and approved.
            </p>
          </div>
          <button type="button" className="mint-btn h-11 shrink-0 px-4" onClick={() => setOpen(true)}>
            {joined ? 'Waitlist joined' : 'Join the waitlist'}
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="relative mt-8 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="pointer-events-none absolute end-4 top-10 select-none text-7xl font-black tracking-tight text-white/[0.04]">Xelo</p>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint/15">
                <LogoMark />
              </span>
              <span>
                <span className="block font-bold">Xelo Token</span>
                <span className="block text-xs text-white/50">ERC-20 · Arbitrum One</span>
              </span>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">Max supply</dt>
                <dd className="mt-2 text-sm font-semibold num">1,000,000,000 Xelo</dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">Standard</dt>
                <dd className="mt-2 text-sm font-semibold">ERC-20</dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">Network</dt>
                <dd className="mt-2 text-sm font-semibold">Arbitrum One</dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">Launch price</dt>
                <dd className="mt-2 text-sm font-semibold">TBA</dd>
              </div>
            </dl>

            <div id="allocation" className="mt-5 scroll-mt-24">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">Token allocation</p>
              <div className="mt-3 flex h-2 overflow-hidden rounded-full" aria-hidden="true">
                {allocation.map((slice) => (
                  <span key={slice.label} className="h-full" style={{ width: `${slice.pct}%`, background: slice.color }} />
                ))}
              </div>
              <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
                {allocation.map((slice) => (
                  <li key={slice.label} className="flex items-center gap-2 text-[11px] text-white/70">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: slice.color }} />
                    <span className="min-w-0 flex-1 truncate">{slice.label}</span>
                    <span className="num font-semibold text-white/90">{slice.pct}%</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Contract address</p>
              <p className="mt-1 text-lg font-semibold">To be announced</p>
            </div>

            <button type="button" className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-mint/15 text-sm font-bold text-mint" onClick={() => jump('allocation')}>
              View full tokenomics & vesting
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </article>

          <div>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Roadmap</h3>
              <button type="button" className="text-xs font-semibold text-mint" onClick={() => jump('roadmap')}>Full roadmap →</button>
            </div>
            <ol id="roadmap" className="mt-3 space-y-3 scroll-mt-24">
              {phases.map((item) => (
                <li key={item.phase} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.tone === 'done' ? 'bg-mint' : item.tone === 'active' ? 'bg-amber-400' : 'bg-white/25'}`}
                    />
                    <span className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">{item.phase}</span>
                      <span className="block truncate font-semibold">{item.title}</span>
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${item.tone === 'done' ? 'border-mint/40 text-mint' : item.tone === 'active' ? 'border-amber-400/50 text-amber-300' : 'border-white/15 text-white/45'}`}
                  >
                    {item.status}
                  </span>
                </li>
              ))}
            </ol>

            <ul className="mt-3 space-y-3">
              {assurances.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="flex items-center gap-2 font-semibold">
                      <Icon className="h-4 w-4 text-mint" />
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-white/55">{item.body}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-black/70 px-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <form
            className="w-full max-w-md rounded-3xl border border-line bg-elev p-5 text-ink"
            onSubmit={(event) => {
              event.preventDefault();
              submitWaitlist();
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-mint">Xelo pre-launch</p>
                <h3 className="mt-1 text-xl font-bold">Join the waitlist</h3>
              </div>
              <button type="button" className="grid h-8 w-8 place-items-center rounded-full text-muted" aria-label="Close waitlist" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Leave an email for the launch notice. It stays in this browser. No sale is open.
            </p>
            <label className="mt-4 block">
              <span className="text-xs font-semibold text-muted">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                type="email"
                required
                className="field mt-1 rounded-xl border border-line bg-bg px-3 py-2.5"
                placeholder="name@email.com"
              />
            </label>
            {error ? <p className="mt-2 text-sm text-ask">{error}</p> : null}
            {joined ? (
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-mint">
                <Check className="h-4 w-4" />
                This browser is already on the waitlist.
              </p>
            ) : null}
            <button type="submit" className="mint-btn mt-4 h-11 w-full">Save my place</button>
          </form>
        </div>
      ) : null}
    </section>
  );
}
