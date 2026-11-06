import type { Course } from './course';

export const tradingGuide: Course = {
  id: 'how-to-trade',
  base: '/how-to-trade',
  eyebrow: 'Trading guide',
  title: 'How a ticket works on XELORA',
  lede: 'Spot, perpetual futures, and the swap use the same market list. This guide walks the controls on those screens. A submit on the terminal stores a preview in this browser. It is not sent to a venue.',
  searchPlaceholder: 'Search the ticket, leverage, swap, order book',
  heroImage: '/blog/exchange.jpg',
  heroAlt: 'Photograph of a laptop screen showing a candlestick chart in a dark room.',
  heroCaption: 'Photograph via Unsplash. The terminal chart is candles, volume, and a 12-period average.',
  tracks: ['Spot', 'Futures', 'Swap'],
  path: ['open-a-market', 'limit-or-market', 'size-and-percent', 'swap-a-pair'],
  videos: [
    {
      id: 'qn5Xcl4hM90',
      title: 'What are Market and Limit Orders',
      channel: 'TradingView',
      note: 'A market order takes the book now. A limit order waits at the price you type.',
    },
    {
      id: 'Tiyystl8x40',
      title: 'Understanding Market, Limit, and Stop Orders',
      channel: 'Charles Schwab',
      note: 'The same three instructions, explained for a stock ticket. The words match the futures form.',
    },
    {
      id: 'AOz1YPOKvEs',
      title: 'How To Read Candlestick Charts',
      channel: 'Wysetrade',
      note: 'Use this beside the chart. Each interval button redraws the candles.',
    },
  ],
  terms: [
    { term: 'Preview order', meaning: 'A record stored in this browser after you submit. It does not leave the device.' },
    { term: 'Limit', meaning: 'An order that waits for the price you type.' },
    { term: 'Market', meaning: 'An order that takes the current book.' },
    { term: 'Long / Short', meaning: 'The futures buttons. Spot uses Buy and Sell for the same two sides.' },
    { term: 'Cross', meaning: 'The margin label on a perpetual ticket. Collateral is shared across cross positions.' },
    { term: 'Reduce-only', meaning: 'A futures option that may only shrink a position, not add to it.' },
  ],
  lessons: [
    {
      slug: 'open-a-market',
      title: 'Open a market from the list',
      summary: 'Spot and Futures are separate pages. The pair menu, the last price, the 24-hour change, and the favorite star sit on the same row once a market is open.',
      track: 'Spot',
      minutes: 7,
      image: '/blog/board.jpg',
      imageAlt: 'Photograph of a trading terminal with a BTCUSD candlestick chart and a quote panel.',
      practice: { label: 'Open Markets', to: '/markets' },
      sourceLabel: 'Investopedia, bid and ask',
      sourceUrl: 'https://www.investopedia.com/terms/b/bid-and-ask.asp',
      sections: [
        {
          heading: 'Pick the page before the pair',
          paragraphs: [
            'The header links Spot and Futures as two terminals. Spot quotes the coin against USDC and the side buttons read Buy and Sell. Futures is the perpetual book: the side buttons read Long and Short, a funding rate can appear in the stat row, and the ticket adds leverage.',
            'Markets is the index for both. Search a symbol, or use the Spot and Perpetual tabs. Opening a row lands on that pair. The terminal also has its own pair menu beside the coin icon, so you can change markets without going back to the list.',
          ],
        },
        {
          heading: 'Read the row above the chart',
          paragraphs: [
            'The large number is the last price. Beside it is the 24-hour change. High, low, and volume sit in the same strip. On a perpetual, funding is printed there too, as a percent. Those figures describe the book you selected. They are not a target.',
            'The star next to the pair saves that market in this browser. A saved market can be filtered from the Markets page under Favorites. The star does not submit an order and it does not follow you to another device.',
          ],
        },
      ],
    },
    {
      slug: 'limit-or-market',
      title: 'Choose limit or market, then read what submit stores',
      summary: 'Limit shows a price field and waits. Market takes the current price and hides that field. Submit writes a preview order on this device and confirms it in green under the button.',
      track: 'Spot',
      minutes: 8,
      image: '/blog/laptop.jpg',
      imageAlt: 'Photograph of a laptop on a desk with a market dashboard on the screen.',
      videoId: 'qn5Xcl4hM90',
      practice: { label: 'Open the spot terminal', to: '/spot' },
      sourceLabel: 'FINRA, order types',
      sourceUrl: 'https://www.finra.org/investors/investing/investment-products/stocks/order-types',
      sections: [
        {
          heading: 'Two instructions, one form',
          paragraphs: [
            'On the ticket, Limit and Market sit above the size field. Limit keeps a price box so you can name the level you are willing to trade. Market removes that box and uses the live price. Public order guides describe the same split: a market order seeks a fill now, and a limit order refuses a price worse than the one you set, which also means it may never fill.',
            'The futures ticket adds a Cross label on that same row. Spot does not. Take-profit and reduce-only appear only on the perpetual form, as checkboxes under the leverage slider.',
          ],
        },
        {
          heading: 'Submit stores a preview',
          paragraphs: [
            'The button reads Connect Wallet until an address is present. After that it submits. A successful submit clears the size field, switches the lower panel to Positions, and prints “Preview order stored in this browser.” The row records side, size, price, and type. On a perpetual it also records the leverage that was on the slider.',
            'That record stays in this browser. It is not sent to Hyperliquid or any other venue. Use it to check that the ticket captured what you intended. The history tab lists the same preview orders.',
          ],
        },
      ],
      example: {
        title: 'What a preview row keeps',
        rows: [
          { label: 'Side', value: 'Buy on spot, or Long on a perpetual' },
          { label: 'Size', value: 'The units you typed, in the coin' },
          { label: 'Price', value: 'Your limit, or the live price for a market order' },
          { label: 'Type', value: 'Limit or Market' },
          { label: 'Leverage', value: 'Shown when it is above 1×' },
          { label: 'Where it lives', value: 'This browser, until you clear the session data' },
        ],
        note: 'If the row does not match the trade you meant, it is still only a preview. Change the ticket and submit again. Nothing has been sent on.',
      },
    },
    {
      slug: 'size-and-percent',
      title: 'Set size with the percent buttons',
      summary: 'The size field is in coin units. The 10, 25, 50, 75, and 100 buttons fill it from the session balance. On a perpetual, that fill is multiplied by the leverage on the slider.',
      track: 'Futures',
      minutes: 8,
      image: '/blog/desk.jpg',
      imageAlt: 'Photograph of two people reviewing notes and laptops at a wooden desk.',
      practice: { label: 'Size it in the calculator first', to: '/tools/position-risk-calculator' },
      sourceLabel: 'Investopedia, position sizing',
      sourceUrl: 'https://www.investopedia.com/terms/p/positionsizing.asp',
      sections: [
        {
          heading: 'Percent of the balance, then leverage',
          paragraphs: [
            'The five buttons under the size field are shortcuts. On spot, 100% sizes the position from the full session balance at the current price. On a perpetual, the same button sizes from balance times the leverage on the slider. A 10× slider and a 100% click is a much larger coin size than the same click on spot.',
            'You can ignore the buttons and type a size. The value line under the form converts that size into USDC. Margin is that value on spot. On a perpetual, margin is the value divided by leverage. Liquidation is printed only on the perpetual ticket.',
          ],
        },
        {
          heading: 'Decide the loss before the percent',
          paragraphs: [
            'A percent button answers “how much of the balance,” not “how much am I willing to lose.” The position calculator answers the second question from an account, a risk percent, an entry, and a stop. Bring that unit count back to the size field if you want the ticket to match the plan.',
            'The balance the ticket uses while a wallet session is open is the 12,500 USDC shown on the wallet page. Treat the percent buttons as a way to fill the box, and check Value, Margin, and Liquidation before you submit the preview.',
          ],
        },
      ],
    },
    {
      slug: 'leverage-and-liquidation',
      title: 'Move the leverage slider, then read liquidation',
      summary: 'The slider runs from 1× to that market’s maximum. It changes margin and the liquidation estimate. It does not change the fact that a preview stays in the browser.',
      track: 'Futures',
      minutes: 8,
      image: '/blog/phone.jpg',
      imageAlt: 'Photograph of a physical bitcoin token in front of a blurred market screen.',
      practice: { label: 'Open the liquidation calculator', to: '/tools/liquidation-calculator' },
      sourceLabel: 'Binance Academy, liquidation',
      sourceUrl: 'https://www.binance.com/en/academy/articles/what-is-liquidation-in-crypto-futures',
      sections: [
        {
          heading: 'What the slider is doing',
          paragraphs: [
            'Leverage is a control on the perpetual ticket only. The number at the right of the label is the multiple. Dragging it toward the market’s maximum reduces the margin line and pulls the liquidation estimate toward the entry. Dragging it back toward 1× does the opposite.',
            'Long and Short choose the direction of that estimate. A long’s liquidation sits below the price. A short’s sits above. The Cross label means the form is describing shared margin. The calculator under Tools uses isolated math so you can see a single-position box before you trust the shared one.',
          ],
        },
        {
          heading: 'Take profit and reduce-only',
          paragraphs: [
            'Take profit and reduce-only are checkboxes on the perpetual form. Take profit marks the preview as a target-bearing order. Reduce-only marks it as an order that should only shrink a position. Both are stored with the preview. Neither is routed to a matching engine in this build.',
            'If the liquidation number is closer than the move you are willing to sit through, lower the leverage or the size before you submit. The chart does not have to be touched for that check.',
          ],
        },
      ],
    },
    {
      slug: 'chart-and-book',
      title: 'Use the chart, the book, and the trades tab',
      summary: 'Interval buttons redraw the candles. The middle column switches between the order book and recent prints. The spread is the gap in the middle of the book.',
      track: 'Futures',
      minutes: 7,
      image: '/blog/markets.jpg',
      imageAlt: 'Photograph of a monitor showing red and green candlesticks and moving-average lines.',
      videoId: 'AOz1YPOKvEs',
      practice: { label: 'Open a futures chart', to: '/futures' },
      sourceLabel: 'Investopedia, candlestick',
      sourceUrl: 'https://www.investopedia.com/terms/c/candlestick.asp',
      sections: [
        {
          heading: 'The chart is a window, not an order',
          paragraphs: [
            'The interval buttons sit above the candles. Choosing another interval rebuilds the series for that window. MA 12 is the short average drawn with the candles. It lags the last print. Changing the interval does not change an open preview.',
            'A candle’s body is the open and the close of that window. The wicks are the high and the low. The lecture linked on this lesson walks the same four prices. Read it, then look at the interval you actually have selected.',
          ],
        },
        {
          heading: 'Book and trades',
          paragraphs: [
            'The middle column has two tabs. Order book lists asks above a spread line and bids below it, with size and USDC total. The bar at the top is the buy and sell share of the visible book. Trades replaces that ladder with recent prints and a side.',
            'The spread figure is the gap between the best prices in that ladder. A wide spread means a market order is more expensive than the last price suggests. Limit is the control that refuses to cross a gap you have not accepted.',
          ],
        },
      ],
    },
    {
      slug: 'swap-a-pair',
      title: 'Swap with each coin chosen on its own',
      summary: 'Pay and receive are separate menus. The header pair is receive over pay. Refresh the quote before you connect a wallet. The quote is a preview, like the terminal order.',
      track: 'Swap',
      minutes: 7,
      image: '/blog/coins.jpg',
      imageAlt: 'Close-up photograph of a physical bitcoin token on a woven cloth.',
      practice: { label: 'Open the swap', to: '/swap' },
      sourceLabel: 'Uniswap docs, swaps',
      sourceUrl: 'https://docs.uniswap.org/concepts/protocol/swaps',
      sections: [
        {
          heading: 'Two pickers, one pair',
          paragraphs: [
            'The swap card lets you change the pay coin without changing the receive coin, and the reverse. USDC is on both lists. The pair printed in the header follows the two symbols you picked, receive first. Flipping the card swaps those symbols.',
            'A quote is a snapshot of the amount out for the amount in. Refresh it before you sign anything. Public swap docs treat that snapshot as an estimate that can move before a transaction is included. If the numbers have changed past the trade you wanted, do not continue.',
          ],
        },
        {
          heading: 'Connect is the same picker',
          paragraphs: [
            'The connect button on the swap card opens the wallet picker used everywhere else. It does not fill in a seed phrase, and it does not submit the quote by itself. When an address is already in the session, the card can show the sample available balance of 12,500 USDC.',
            'After you have looked at a terminal preview and a swap quote, the positions panel under the futures chart and the history on the wallet page are the two places those browser records show up. The journal is a separate page for notes you write yourself.',
          ],
        },
      ],
    },
  ],
};
