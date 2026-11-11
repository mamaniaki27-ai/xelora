import { useEffect, useState, type ReactNode } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { infoPages } from '../data/pages';
import { humanCheckPassed, markHumanCheckPassed } from '../lib/human-check';
import { SessionProvider } from '../stores/session';
import { TradeProvider } from '../stores/trade';
import { useUiStore, UiProvider } from '../stores/ui';
import AboutPage from './pages/AboutPage';
import BlogArticle from './pages/BlogArticle';
import BlogPage from './pages/BlogPage';
import CalculatorPage from './pages/CalculatorPage';
import CourseArticle from './pages/CourseArticle';
import CoursePage from './pages/CoursePage';
import FundingPage from './pages/FundingPage';
import HomePage from './pages/HomePage';
import InfoPage from './pages/InfoPage';
import JournalPage from './pages/JournalPage';
import LearnLesson from './pages/LearnLesson';
import LearnPage from './pages/LearnPage';
import MarketsPage from './pages/MarketsPage';
import PulsePage from './pages/PulsePage';
import ReferralsPage from './pages/ReferralsPage';
import ScreenerPage from './pages/ScreenerPage';
import SwapPage from './pages/SwapPage';
import TerminalPage from './pages/TerminalPage';
import TokenPage from './pages/TokenPage';
import ToolsPage from './pages/ToolsPage';
import WalletPage from './pages/WalletPage';
import ConnectModal from './shell/ConnectModal';
import AppFooter from './shell/AppFooter';
import AppHeader from './shell/AppHeader';
import HumanCheck from './shell/HumanCheck';
import MobileNav from './shell/MobileNav';
import TickerTape from './shell/TickerTape';

const dedicated = new Set(['market-pulse', 'funding-radar', 'crypto-prices', 'tools', 'screener', 'journal', 'referrals', 'token', 'blog', 'learn', 'how-to-trade', 'how-to-use-wallet', 'guide', 'about']);

const infoRoutes = infoPages.filter((page) => !dedicated.has(page.id));

function Page({ title, children }: { title: string; children: ReactNode }) {
  useEffect(() => {
    document.title = title.startsWith('XELORA') ? title : `${title} | XELORA`;
  }, [title]);
  return children;
}

function Shell() {
  const { setMenuOpen } = useUiStore();
  const location = useLocation();
  const [cleared, setCleared] = useState(humanCheckPassed);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, setMenuOpen]);

  useEffect(() => {
    if (cleared) return;
    document.title = 'Verify you are human | XELORA';
  }, [cleared]);

  function pass() {
    markHumanCheckPassed();
    setCleared(true);
  }

  if (!cleared) return <HumanCheck onPass={pass} />;

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-ink">
      <AppHeader />
      <TickerTape />
      <main className="flex-1 pb-24 lg:pb-0">
        <Routes>
          <Route path="/" element={<Page title="Non-custodial markets, futures and swaps"><HomePage /></Page>} />
          <Route path="/markets" element={<Page title="Markets"><MarketsPage /></Page>} />
          <Route path="/futures" element={<Page title="Perpetual futures"><TerminalPage /></Page>} />
          <Route path="/spot" element={<Page title="Spot"><TerminalPage /></Page>} />
          <Route path="/swap" element={<Page title="Swap"><SwapPage /></Page>} />
          <Route path="/wallet" element={<Page title="Wallet"><WalletPage /></Page>} />
          <Route path="/trade/:pair" element={<Page title="Trade"><TerminalPage /></Page>} />
          <Route path="/market-pulse" element={<Page title="Market Pulse & Watchlist"><PulsePage /></Page>} />
          <Route path="/funding-radar" element={<Page title="Funding & Liquidation Radar"><FundingPage /></Page>} />
          <Route path="/screener" element={<Page title="Indicator Screener"><ScreenerPage /></Page>} />
          <Route path="/journal" element={<Page title="Trading journal"><JournalPage /></Page>} />
          <Route path="/referrals" element={<Page title="Referrals"><ReferralsPage /></Page>} />
          <Route path="/token" element={<Page title="Xelo Token"><TokenPage /></Page>} />
          <Route path="/blog" element={<Page title="Blog"><BlogPage /></Page>} />
          <Route path="/blog/:slug" element={<Page title="Blog"><BlogArticle /></Page>} />
          <Route path="/learn" element={<Page title="Learning center"><LearnPage /></Page>} />
          <Route path="/learn/:slug" element={<Page title="Learning center"><LearnLesson /></Page>} />
          <Route path="/how-to-trade" element={<Page title="Trading guide"><CoursePage /></Page>} />
          <Route path="/how-to-trade/:slug" element={<Page title="Trading guide"><CourseArticle /></Page>} />
          <Route path="/how-to-use-wallet" element={<Page title="Wallet guide"><CoursePage /></Page>} />
          <Route path="/how-to-use-wallet/:slug" element={<Page title="Wallet guide"><CourseArticle /></Page>} />
          <Route path="/guide" element={<Page title="Guides & education"><CoursePage /></Page>} />
          <Route path="/guide/:slug" element={<Page title="Guides & education"><CourseArticle /></Page>} />
          <Route path="/about" element={<Page title="About"><AboutPage /></Page>} />
          <Route path="/tools" element={<Page title="Tools"><ToolsPage /></Page>} />
          <Route path="/tools/:slug" element={<Page title="Calculator"><CalculatorPage /></Page>} />
          <Route path="/crypto-prices" element={<Page title="Crypto prices"><MarketsPage /></Page>} />
          {infoRoutes.map((page) => (
            <Route key={page.path} path={page.path} element={<Page title={page.title}><InfoPage /></Page>} />
          ))}
          <Route path="*" element={<Page title="Not found"><InfoPage /></Page>} />
        </Routes>
      </main>
      <AppFooter />
      <MobileNav />
      <ConnectModal />
    </div>
  );
}

export default function App() {
  return (
    <UiProvider>
      <SessionProvider>
        <TradeProvider>
          <BrowserRouter>
            <Shell />
          </BrowserRouter>
        </TradeProvider>
      </SessionProvider>
    </UiProvider>
  );
}
