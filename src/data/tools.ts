export type ToolCategory = 'risk' | 'market' | 'yield';

export type ToolDef = {
  slug: string;
  title: string;
  category: ToolCategory;
  summary: string;
};

export const toolCategoryLabel: Record<ToolCategory | 'all', string> = {
  all: 'All categories',
  risk: 'Trading & risk',
  market: 'Market & valuation',
  yield: 'Yield & funding',
};

export const tools: ToolDef[] = [
  { slug: 'profit-calculator', title: 'Profit Calculator', category: 'risk', summary: 'Calculate profit or loss for a spot or futures trade, including the fee you enter.' },
  { slug: 'position-risk-calculator', title: 'Position Size & Risk', category: 'risk', summary: 'Size a position from account risk, entry, and stop.' },
  { slug: 'liquidation-calculator', title: 'Liquidation Calculator', category: 'risk', summary: 'Estimate isolated-margin liquidation from entry, leverage, and maintenance margin.' },
  { slug: 'futures-pnl-calculator', title: 'Futures PnL Calculator', category: 'risk', summary: 'Estimate futures PnL after the trade fee you enter.' },
  { slug: 'funding-rate-calculator', title: 'Funding Rate Calculator', category: 'yield', summary: 'Project funding across 8-hour periods for a long or short.' },
  { slug: 'leverage-calculator', title: 'Leverage Calculator', category: 'risk', summary: 'Find leverage from margin and position notional.' },
  { slug: 'roi-calculator', title: 'ROI Calculator', category: 'risk', summary: 'Compute return on investment from cost and current value.' },
  { slug: 'break-even-calculator', title: 'Break-even Calculator', category: 'risk', summary: 'Find the exit price that covers entry fees.' },
  { slug: 'stop-loss-calculator', title: 'Stop Loss Calculator', category: 'risk', summary: 'Place a stop from the maximum loss you will accept.' },
  { slug: 'take-profit-calculator', title: 'Take Profit Calculator', category: 'risk', summary: 'Place a target from a reward multiple of the risk.' },
  { slug: 'market-cap-calculator', title: 'Market Cap Calculator', category: 'market', summary: 'Market cap from price and circulating supply.' },
  { slug: 'token-price-calculator', title: 'Token Price Calculator', category: 'market', summary: 'Token price from market cap and circulating supply.' },
  { slug: 'dca-calculator', title: 'DCA Calculator', category: 'yield', summary: 'Average entry from a repeated buy amount and count.' },
  { slug: 'apr-calculator', title: 'APR Calculator', category: 'yield', summary: 'Turn a simple APR into a period return.' },
  { slug: 'apy-calculator', title: 'APY Calculator', category: 'yield', summary: 'Compound an APR into APY.' },
];

export function toolPath(slug: string) {
  return `/tools/${slug}`;
}
