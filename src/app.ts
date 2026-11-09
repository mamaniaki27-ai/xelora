import type { App } from 'vue';
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { getPinia } from './stores/pinia';
import { infoPages } from './data/pages';
import HomePage from './components/pages/HomePage.vue';
import MarketsPage from './components/pages/MarketsPage.vue';
import TerminalPage from './components/pages/TerminalPage.vue';
import SwapPage from './components/pages/SwapPage.vue';
import WalletPage from './components/pages/WalletPage.vue';
import InfoPage from './components/pages/InfoPage.vue';
import ToolsPage from './components/pages/ToolsPage.vue';
import CalculatorPage from './components/pages/CalculatorPage.vue';
import PulsePage from './components/pages/PulsePage.vue';
import FundingPage from './components/pages/FundingPage.vue';
import ScreenerPage from './components/pages/ScreenerPage.vue';
import JournalPage from './components/pages/JournalPage.vue';
import ReferralsPage from './components/pages/ReferralsPage.vue';
import TokenPage from './components/pages/TokenPage.vue';
import BlogPage from './components/pages/BlogPage.vue';
import BlogArticle from './components/pages/BlogArticle.vue';
import LearnPage from './components/pages/LearnPage.vue';
import LearnLesson from './components/pages/LearnLesson.vue';
import CoursePage from './components/pages/CoursePage.vue';
import CourseArticle from './components/pages/CourseArticle.vue';
import AboutPage from './components/pages/AboutPage.vue';
import { HUMAN_CHECK_KEY } from './lib/human-check';

const dedicated = new Set(['market-pulse', 'funding-radar', 'crypto-prices', 'tools', 'screener', 'journal', 'referrals', 'token', 'blog', 'learn', 'how-to-trade', 'how-to-use-wallet', 'guide', 'about']);

const infoRoutes: RouteRecordRaw[] = infoPages
  .filter((page) => !dedicated.has(page.id))
    .map((page) => ({
    path: page.path,
    component: InfoPage,
    meta: { title: page.title },
  }));

export function createAppRouter() {
  return createRouter({
    history: createWebHistory(),
    scrollBehavior() {
      return { top: 0 };
    },
    routes: [
      { path: '/', component: HomePage, meta: { title: 'Non-custodial markets, futures and swaps' } },
      { path: '/markets', component: MarketsPage, meta: { title: 'Markets' } },
      { path: '/futures', component: TerminalPage, meta: { title: 'Perpetual futures' } },
      { path: '/spot', component: TerminalPage, meta: { title: 'Spot' } },
      { path: '/swap', component: SwapPage, meta: { title: 'Swap' } },
      { path: '/wallet', component: WalletPage, meta: { title: 'Wallet' } },
      { path: '/trade/:pair', component: TerminalPage, meta: { title: 'Trade' } },
      { path: '/market-pulse', component: PulsePage, meta: { title: 'Market Pulse & Watchlist' } },
      { path: '/funding-radar', component: FundingPage, meta: { title: 'Funding & Liquidation Radar' } },
      { path: '/screener', component: ScreenerPage, meta: { title: 'Indicator Screener' } },
      { path: '/journal', component: JournalPage, meta: { title: 'Trading journal' } },
      { path: '/referrals', component: ReferralsPage, meta: { title: 'Referrals' } },
      { path: '/token', component: TokenPage, meta: { title: 'Xelo Token' } },
      { path: '/blog', component: BlogPage, meta: { title: 'Blog' } },
      { path: '/blog/:slug', component: BlogArticle, meta: { title: 'Blog' } },
      { path: '/learn', component: LearnPage, meta: { title: 'Learning center' } },
      { path: '/learn/:slug', component: LearnLesson, meta: { title: 'Learning center' } },
      { path: '/how-to-trade', component: CoursePage, meta: { title: 'Trading guide' } },
      { path: '/how-to-trade/:slug', component: CourseArticle, meta: { title: 'Trading guide' } },
      { path: '/how-to-use-wallet', component: CoursePage, meta: { title: 'Wallet guide' } },
      { path: '/how-to-use-wallet/:slug', component: CourseArticle, meta: { title: 'Wallet guide' } },
      { path: '/guide', component: CoursePage, meta: { title: 'Guides & education' } },
      { path: '/guide/:slug', component: CourseArticle, meta: { title: 'Guides & education' } },
      { path: '/about', component: AboutPage, meta: { title: 'About' } },
      { path: '/tools', component: ToolsPage, meta: { title: 'Tools' } },
      { path: '/tools/:slug', component: CalculatorPage, meta: { title: 'Calculator' } },
      { path: '/crypto-prices', component: MarketsPage, meta: { title: 'Crypto prices' } },
      ...infoRoutes,
      { path: '/:pathMatch(.*)*', component: InfoPage, meta: { title: 'Not found' } },
    ],
  });
}

export default function setupApp(app: App) {
  const router = createAppRouter();
  router.afterEach((to) => {
    if (typeof document === 'undefined') return;
    try {
      if (sessionStorage.getItem(HUMAN_CHECK_KEY) !== '1') {
        document.title = 'Verify you are human | XELORA';
        return;
      }
    } catch {
      /* Ignore storage failures and keep the route title. */
    }
    const title = typeof to.meta.title === 'string' ? to.meta.title : 'XELORA';
    document.title = title.startsWith('XELORA') ? title : `${title} | XELORA`;
  });
  app.use(getPinia());
  app.use(router);
}
