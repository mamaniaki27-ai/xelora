export const pageSections: Record<string, { title: string; body: string }[]> = {
  '/about': [
    { title: 'What XELORA is', body: 'A non-custodial front end for spot, perpetual futures, and swaps. The wallet holds the keys.' },
    { title: 'What a submit stores', body: 'The terminal keeps a preview order in this browser. It is not sent to a venue.' },
    { title: 'Where to read', body: 'Learn, the trading guide, the wallet guide, and the blog are linked from About.' },
  ],
  '/token': [
    { title: 'Token status', body: 'No token contract is deployed. The contract address is to be announced.' },
    { title: 'Planned network', body: 'The reference design reserves an ERC-20 slot. Nothing here can be transferred or staked.' },
    { title: 'Allocation', body: 'Allocation, vesting, and a public lock are unpublished. This page only reserves the layout.' },
  ],
  '/learn': [
    { title: 'Start with markets', body: 'Open Markets, search a symbol, and use the tags to narrow the list. A gold star saves that market as a recommendation.' },
    { title: 'Read the chart', body: 'The futures chart shows candles, a 12-period average, volume, and the last price. Change the interval to redraw the series.' },
    { title: 'Use the calculators', body: 'Tools estimates size, liquidation, fees, and funding from the numbers you type. They do not place orders.' },
  ],
  '/how-to-trade': [
    { title: 'Choose a market', body: 'Open Futures or Spot and pick a pair. The coin mark, last price, and 24h change sit above the chart.' },
    { title: 'Set size', body: 'Use the percent buttons to fill a preview size from the sample balance, or type a size yourself.' },
    { title: 'Submit a preview', body: 'Connect the preview wallet, then submit. The position appears in the panel under the chart and stays in this browser.' },
  ],
  '/how-to-use-wallet': [
    { title: 'Connect', body: 'Connect Wallet opens a preview session. It does not request a signature or a seed phrase.' },
    { title: 'Balances', body: 'The wallet screen shows sample balances for that session so the rest of the interface can show an available amount.' },
    { title: 'Disconnect', body: 'The address button in the header ends the session and clears the stored preview address.' },
  ],
  '/guide': [
    { title: 'Navigation', body: 'Home, Markets, Spot, Futures, and Swap are direct links. Explore, Tools, and More open menus with the same row height and icon size.' },
    { title: 'Search', body: 'Markets, Explore boards, Tools, the journal, and these guides each include a search field.' },
    { title: 'Favorites', body: 'The recommend star turns gold when a market is saved and returns to the outline when you click it again.' },
  ],
  '/blog': [
    { title: 'Chart update', body: 'The terminal chart now uses a directional candle series, volume, and a moving average instead of a random stroke.' },
    { title: 'Coin marks', body: 'Listed assets use the same coin artwork as the reference exchange wherever that file is published.' },
    { title: 'Calculators', body: 'The tools index can be filtered by name or category, and each calculator returns a number from its inputs.' },
  ],
  '/api-docs': [
    { title: 'No public trading API', body: 'Screens read the local market list. There is no order, account, or candle endpoint in this build.' },
    { title: 'Market fields', body: 'Each market has a symbol, pair, price, 24h change, volume, and, for perpetuals, funding and max leverage.' },
  ],
  '/announcements': [
    { title: 'No published announcements', body: 'The reference status is empty. New product notes will be listed here with a date.' },
    { title: 'Preview build', body: 'Navigation, coin artwork, the recommend star, and the calculator set were updated in this pass.' },
  ],
  '/help': [
    { title: 'Find a market', body: 'Use the search box on Markets or on Market pulse. Tags filter the same list and do not remove the search field.' },
    { title: 'Open a calculator', body: 'Tools lists every calculator. Search by funding, risk, or token price.' },
  ],
  '/fees': [
    { title: 'Platform fee', body: 'This preview adds no platform fee. The swap note says venue fees would follow the connected fee tier.' },
  ],
  '/trading-fees': [
    { title: 'Maker and taker', body: 'Maker, taker, and funding belong to the venue. The futures PnL calculator subtracts only the fee percent you enter.' },
  ],
  '/security': [
    { title: 'Keys', body: 'The interface never asks for a seed phrase. The preview address is stored in local storage on this device.' },
  ],
  '/status': [
    { title: 'Front end', body: 'The local preview is serving. Upstream market connections are not monitored.' },
  ],
};
