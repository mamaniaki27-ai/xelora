import { useMemo, useState } from 'react';
import { useSessionStore } from '../../stores/session';

export default function ReferralsPage() {
  const session = useSessionStore();
  const [copied, setCopied] = useState(false);
  const code = useMemo(() => (session.address ? `XEL-${session.address.slice(2, 8).toUpperCase()}` : 'XEL-GUEST'), [session.address]);
  const link = useMemo(() => `https://xelora.local/r/${code}`, [code]);

  async function copy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-semibold">Referrals</h1>
      <p className="mt-2 text-sm text-muted">Share a preview code. Connecting a wallet changes the code to that session.</p>
      <form className="mt-5" role="search" onSubmit={(event) => event.preventDefault()}>
        <input className="field w-full rounded-xl border border-line bg-elev px-4 py-2.5" value={code} readOnly aria-label="Search referrals" />
      </form>
      <div className="panel mt-4 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Your code</p>
        <p className="mt-2 text-3xl font-semibold tracking-wide">{code}</p>
        <p className="mt-3 break-all text-sm text-muted">{link}</p>
        <button type="button" className="mint-btn mt-4 h-10 px-4" onClick={() => void copy()}>{copied ? 'Copied' : 'Copy link'}</button>
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        <li className="panel p-4"><p className="text-2xl font-semibold num">0</p><p className="text-xs text-muted">Invites joined</p></li>
        <li className="panel p-4"><p className="text-2xl font-semibold num">0</p><p className="text-xs text-muted">Qualified traders</p></li>
        <li className="panel p-4"><p className="text-2xl font-semibold num">0</p><p className="text-xs text-muted">Rewards</p></li>
      </ul>
    </section>
  );
}
