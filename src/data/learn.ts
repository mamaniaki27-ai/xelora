export type LearnTrack = 'Basics' | 'Markets' | 'Risk' | 'Wallets';

export type LearnSection = {
  heading: string;
  paragraphs: string[];
};

export type LearnExample = {
  title: string;
  rows: Array<{ label: string; value: string }>;
  note: string;
};

export type LearnLesson = {
  slug: string;
  title: string;
  summary: string;
  track: LearnTrack;
  minutes: number;
  image: string;
  imageAlt: string;
  videoId?: string;
  practice?: { label: string; to: string };
  sourceLabel: string;
  sourceUrl: string;
  sections: LearnSection[];
  example?: LearnExample;
};

export type LearnVideo = {
  id: string;
  title: string;
  channel: string;
  note: string;
};

export const learnTracks: Array<LearnTrack | 'All'> = ['All', 'Basics', 'Markets', 'Risk', 'Wallets'];

export const learnPath = ['what-crypto-is', 'keys-and-wallets', 'reading-candles', 'size-from-the-stop'];

export const learnVideos: LearnVideo[] = [
  {
    id: 'bBC-nXj3Ng4',
    title: 'But how does bitcoin actually work?',
    channel: '3Blue1Brown',
    note: 'A clear walk through keys, the ledger, and why a transfer can be checked without a bank in the middle.',
  },
  {
    id: 'SSo_EIwHSd4',
    title: 'How does a blockchain work',
    channel: 'Simply Explained',
    note: 'A short picture of blocks, hashes, and what it means for a record to be shared.',
  },
  {
    id: 'kubGCSj5y3k',
    title: 'How Cryptocurrencies Actually Work',
    channel: 'SciShow',
    note: 'A plain-language tour of coins, mining, and why the unit has a price only when someone trades it.',
  },
  {
    id: 'AOz1YPOKvEs',
    title: 'How To Read Candlestick Charts',
    channel: 'Wysetrade',
    note: 'Open, high, low, and close, and how a green candle and a red candle swap those roles.',
  },
];

export const learnLessons: LearnLesson[] = [
  {
    slug: 'what-crypto-is',
    title: 'What a cryptocurrency is',
    summary: 'A coin is an entry on a shared ledger. The object in a photograph is a souvenir. The spendable unit is a balance that a private key can move.',
    track: 'Basics',
    minutes: 8,
    image: '/blog/coins.jpg',
    imageAlt: 'Close-up photograph of a physical bitcoin token on a woven cloth.',
    videoId: 'bBC-nXj3Ng4',
    practice: { label: 'Open the market list', to: '/markets' },
    sourceLabel: 'Bitcoin.org, how it works',
    sourceUrl: 'https://bitcoin.org/en/how-it-works',
    sections: [
      {
        heading: 'The coin in the photo is not the asset',
        paragraphs: [
          'A physical token stamped with a symbol is a prop. The asset that trades on a market is a balance recorded by software that many computers keep in agreement. Bitcoin’s own introduction describes this as a peer-to-peer system: transfer is a signed message that the network accepts, not a file you email to someone.',
          'That is why two people can look at the same address and see the same balance without either of them trusting the other’s laptop. The record is public. The authority to change a particular balance is private.',
        ],
      },
      {
        heading: 'A unit has rules before it has a price',
        paragraphs: [
          'Each network publishes how new units come into existence, how a transfer is validated, and what makes one history the history everyone else follows. Those rules differ. Bitcoin limits issuance on a schedule. Account-based networks such as Ethereum let a single address hold many different tokens, each with its own contract rules.',
          'None of those rules set the price. The price is the last trade, or the quote someone is willing to trade at right now. A market screen is a view of those trades. It is not a statement from the network about what the unit is “worth.”',
        ],
      },
      {
        heading: 'Names collide, and the ticker is not enough',
        paragraphs: [
          'The same three or four letters can be used by unrelated assets. A careful reader checks the network and, where the asset is a token, the contract. On XELORA the market list uses the symbols the venue publishes. If a symbol is unfamiliar, treat it as unfamiliar: open the market, read the pair, and decide whether that book is the one you meant.',
          'Stablecoins are a special case of the same idea. They aim to track a currency, usually the dollar, and they still have an issuer, a chain, and a contract. “USD” in a label is not automatically USDC.',
        ],
      },
    ],
  },
  {
    slug: 'keys-and-wallets',
    title: 'Keys, wallets, and what a signature proves',
    summary: 'A wallet stores a key and uses it to sign. The trading screen can ask for that signature. It should never ask for the phrase that recreates the key.',
    track: 'Wallets',
    minutes: 9,
    image: '/blog/security.jpg',
    imageAlt: 'Photograph of a person holding a bank card while typing on a laptop.',
    practice: { label: 'Read the wallet guide', to: '/how-to-use-wallet' },
    sourceLabel: 'Ethereum.org, wallets',
    sourceUrl: 'https://ethereum.org/en/wallets/',
    sections: [
      {
        heading: 'The key is the account',
        paragraphs: [
          'Public wallet guides describe a wallet as software or a device that holds cryptographic keys. The address others can see is derived from the public side of that key. The private side is what produces a signature. Whoever can produce the signature can move the balance. There is no separate “forgot password” desk inside the network.',
          'A recovery phrase is a human-readable backup of that key material. Anyone who reads it can recreate the wallet. Support staff, a website form, and a direct message are all the wrong place for it. XELORA’s connection flow asks a wallet to connect and to sign. The phrase stays where you stored it.',
        ],
      },
      {
        heading: 'A signature is a yes to a specific payload',
        paragraphs: [
          'Connecting a wallet shares an address so the interface can look up balances. Signing approves a specific payload: a transfer, an order, or a token allowance. Those are different steps. A screen that becomes “connected” has not been given permission to move funds until a signature says so.',
          'Read the payload in the wallet, not only in the browser. Amount, asset, and destination are the three lines that matter. If the wallet shows a spender or a contract you do not recognize, the correct action is to reject it.',
        ],
      },
      {
        heading: 'Where the key sits changes the review',
        paragraphs: [
          'A browser or mobile wallet keeps the key on that device and shows the prompt in the same environment as the trading site. A hardware wallet keeps the key on a separate device and shows the details on its own screen. Ethereum.org groups wallets this way so you can choose a signer that matches how you work.',
          'Either kind of wallet is compatible with a non-custodial front end. The front end prepares the request. The wallet decides. XELORA is built in that order: market, size, and quote on this site, then the signer you already use.',
        ],
      },
    ],
  },
  {
    slug: 'how-spot-price-forms',
    title: 'How a spot price gets onto the screen',
    summary: 'Last price is the most recent trade. The number you can actually deal at is the best bid or the best ask, and the gap between them is the spread.',
    track: 'Markets',
    minutes: 8,
    image: '/blog/board.jpg',
    imageAlt: 'Photograph of a trading terminal with a BTCUSD candlestick chart and a quote panel.',
    practice: { label: 'Compare pairs on Markets', to: '/markets' },
    sourceLabel: 'Investopedia, bid and ask',
    sourceUrl: 'https://www.investopedia.com/terms/b/bid-and-ask.asp',
    sections: [
      {
        heading: 'Three numbers that are easy to mix up',
        paragraphs: [
          'A market list usually leads with the last traded price and the change over 24 hours. The last trade is history. The live market is the order book: bids from people willing to buy, asks from people willing to sell. Market primers call the highest bid and the lowest ask the inside market. The difference is the spread.',
          'A buy that demands an immediate fill pays the ask. A sell that demands an immediate fill hits the bid. Quoting “the price” as a single number hides that. On a quiet pair the spread can be wide enough that the last trade is a poor guide to the next fill.',
        ],
      },
      {
        heading: 'Volume says whether the print was crowded',
        paragraphs: [
          'The 24-hour change and the 24-hour volume answer different questions. Change says how far the last price moved. Volume says how much size traded while it moved. A large percentage change on thin volume is a few trades. The same change on heavy volume is a market that many participants repriced.',
          'XELORA’s market list shows the venue’s price, change, and volume together for that reason. Read them as a set. A gold star on a row only saves the market for you. It does not mean the book is liquid.',
        ],
      },
      {
        heading: 'The pair is part of the price',
        paragraphs: [
          'A price of 100 means nothing until you know the quote asset. 100 USDC per coin and 100 of another coin are different statements. Spot markets on this interface are quoted in the pair printed on the row. The swap screen makes the same point by letting each side of the pair be chosen on its own.',
          'Before you compare a number with a headline, match the symbol, the quote asset, and the market type. A perpetual can print a different number from spot for the same name, which is the subject of the funding lesson.',
        ],
      },
    ],
  },
  {
    slug: 'reading-candles',
    title: 'How to read a candlestick',
    summary: 'Each candle is a time window. The body is the open and the close. The wicks are the high and the low. The color says which of the open or the close came first.',
    track: 'Markets',
    minutes: 10,
    image: '/blog/exchange.jpg',
    imageAlt: 'Photograph of a laptop screen showing a candlestick chart in a dark room.',
    videoId: 'AOz1YPOKvEs',
    practice: { label: 'Open a futures chart', to: '/futures' },
    sourceLabel: 'Investopedia, candlestick',
    sourceUrl: 'https://www.investopedia.com/terms/c/candlestick.asp',
    sections: [
      {
        heading: 'Four prices, one window',
        paragraphs: [
          'Chart references describe a candlestick as the open, high, low, and close of a chosen interval. On a one-hour chart, each candle is one hour. On a one-day chart, each candle is one day. The interval is a setting, so the same market tells a different story when you change it.',
          'The body covers the open and the close. A candle that closes above its open is drawn in the up color, and the close sits at the top of the body. A candle that closes below its open uses the down color, and the close sits at the bottom. The wicks, or shadows, mark the highest and lowest trades inside that window, including prices the market left behind before the close.',
        ],
      },
      {
        heading: 'What a long wick is saying',
        paragraphs: [
          'A long upper wick means the market traded higher during the window and then closed back down. A long lower wick means it traded lower and then closed back up. The wick records a rejection of those prices for that window. It does not promise the next window will do the same.',
          'A candle with a small body and long wicks on both sides is a window that traveled and finished near where it started. Treat it as information about the range, then look at the candles around it. One candle is a sentence. The trend, if there is one, is the paragraph.',
        ],
      },
      {
        heading: 'Put volume under the candle',
        paragraphs: [
          'The futures chart on XELORA draws candles, a short moving average, and volume. The average is a smoother of recent closes. It lags. It is there so a single tall candle does not erase the recent path. Volume under the candle tells you whether that window’s range came with size.',
          'Use the chart to describe what already printed. The decision to buy or sell still needs a size and an exit, which is the risk lesson later in this course. Changing the interval redraws the series. It does not change the position you already have.',
        ],
      },
    ],
  },
  {
    slug: 'funding-on-a-perpetual',
    title: 'Funding on a perpetual, with the arithmetic',
    summary: 'A perpetual has no expiry, so longs and shorts pay each other on a schedule to keep the contract near spot. The payment is a rate times your position, and the rate changes.',
    track: 'Markets',
    minutes: 11,
    image: '/blog/laptop.jpg',
    imageAlt: 'Photograph of a laptop on a desk with a market dashboard on the screen.',
    practice: { label: 'Open the funding calculator', to: '/tools/funding-rate-calculator' },
    sourceLabel: 'Binance Academy, funding rates',
    sourceUrl: 'https://www.binance.com/en/academy/articles/what-are-funding-rates-in-binance-futures',
    sections: [
      {
        heading: 'Why the contract needs a payment at all',
        paragraphs: [
          'A dated future converges toward spot because it expires. A perpetual does not expire. Futures explainers describe funding as the replacement: at a fixed interval, one side of the open interest pays the other. When the perpetual trades above the spot reference, longs typically pay shorts. When it trades below, shorts typically pay longs.',
          'The payment is not a fee the platform pockets in the standard description of the mechanism. It moves between the traders who hold positions across the timestamp. If you open and close between timestamps, you do not pay that interval. If you hold across it, you do.',
        ],
      },
      {
        heading: 'The rate is a price of holding, and it resets',
        paragraphs: [
          'Venues publish a funding rate for the next interval, often eight hours. The dollar amount is the rate multiplied by the notional of your position. A positive rate charged to longs is a cost of being long and a credit to shorts, for that interval only. The next interval can flip.',
          'A high rate says the perpetual is rich or cheap relative to the reference, and that traders are paying up to hold that side. It does not say the next candle will reverse. Read it next to the spot price and the basis. XELORA’s funding tools exist so you can turn a published rate into a currency amount before you care about the story.',
        ],
      },
    ],
    example: {
      title: 'One interval, written out',
      rows: [
        { label: 'Position notional', value: '10,000 USDC' },
        { label: 'Funding rate', value: '0.01% (0.0001)' },
        { label: 'Who pays if the rate is positive', value: 'Longs pay shorts' },
        { label: 'Payment for this interval', value: '1.00 USDC' },
        { label: 'Intervals in a day', value: '3, if the venue uses 8 hours' },
        { label: 'Only if this rate held all day', value: '3.00 USDC' },
      ],
      note: 'The last line is arithmetic, not a forecast. Plug the live rate into the funding calculator. The rate on the next timestamp is a new number.',
    },
  },
  {
    slug: 'size-from-the-stop',
    title: 'Size the trade from the amount you can lose',
    summary: 'Pick the loss first. The distance from entry to stop turns that loss into a position size. Leverage changes the margin, not the loss at the stop.',
    track: 'Risk',
    minutes: 10,
    image: '/blog/desk.jpg',
    imageAlt: 'Photograph of two people reviewing notes and laptops at a wooden desk.',
    practice: { label: 'Open the position calculator', to: '/tools/position-risk-calculator' },
    sourceLabel: 'Investopedia, position sizing',
    sourceUrl: 'https://www.investopedia.com/terms/p/positionsizing.asp',
    sections: [
      {
        heading: 'Risk is a currency amount',
        paragraphs: [
          'Position-sizing references start from the account and a fraction of it you are willing to lose if the idea is wrong. One percent of 10,000 USDC is 100 USDC. That 100 is the budget for the trade. It is not the size of the position, and it is not the margin.',
          'The stop is the price where the idea is wrong. The distance between the entry and the stop, in price, is what converts the budget into a number of units. A wider stop means a smaller position for the same budget. A tighter stop means a larger position, and it will be hit by smaller noise.',
        ],
      },
      {
        heading: 'Leverage is a separate dial',
        paragraphs: [
          'Leverage reduces the margin required to hold a notional. It does not change the arithmetic above. If the stop is 2 points away and you lose 100 USDC at that stop, you lose 100 USDC whether the margin posted was 5,000 or 1,000. The lower margin simply means a closer liquidation if you fail to exit at the stop.',
          'Set the stop on the ticket before the leverage. Then check that the liquidation price sits beyond the stop, with room. If the only way the margin fits is to put liquidation inside the stop, the position is too large for the account.',
        ],
      },
    ],
    example: {
      title: 'A 1% budget on a 2-point stop',
      rows: [
        { label: 'Account', value: '10,000 USDC' },
        { label: 'Risk fraction', value: '1%' },
        { label: 'Loss if the stop fills', value: '100 USDC' },
        { label: 'Entry', value: '100' },
        { label: 'Stop', value: '98' },
        { label: 'Distance', value: '2' },
        { label: 'Size', value: '100 ÷ 2 = 50 units' },
        { label: 'Notional', value: '50 × 100 = 5,000 USDC' },
      ],
      note: 'Fees and slippage can make the loss larger than 100 USDC. The calculator on the Tools page takes the fee you type. This table leaves it at zero so the sizing step stays visible.',
    },
  },
  {
    slug: 'margin-and-liquidation',
    title: 'Margin, maintenance, and liquidation',
    summary: 'Margin is the collateral posted for a position. Liquidation is the price where that collateral no longer covers the loss under the venue’s maintenance rule.',
    track: 'Risk',
    minutes: 9,
    image: '/blog/phone.jpg',
    imageAlt: 'Photograph of a physical bitcoin token in front of a blurred market screen.',
    practice: { label: 'Open the liquidation calculator', to: '/tools/liquidation-calculator' },
    sourceLabel: 'Binance Academy, liquidation',
    sourceUrl: 'https://www.binance.com/en/academy/articles/what-is-liquidation-in-crypto-futures',
    sections: [
      {
        heading: 'Initial margin opens the position',
        paragraphs: [
          'Futures primers separate the collateral you post from the notional you control. At 5x, a 5,000 USDC position asks for about 1,000 USDC of initial margin, before fees. That 1,000 is the capital reserved so the position can exist. It is not a prediction of profit, and it is not the most you can lose if the position is liquidated after further loss.',
          'Maintenance margin is the floor. If losses drag the remaining collateral through that floor, the venue liquidates. The published maintenance rate is part of the liquidation math. A calculator that omits it will print a flattering number.',
        ],
      },
      {
        heading: 'Isolated and cross draw the box differently',
        paragraphs: [
          'Isolated margin locks a chosen amount of collateral to one position. The rest of the account is outside that liquidation. Cross margin lets the account’s available balance back every cross position, which can keep one trade open by using collateral you had mentally assigned to another.',
          'Pick the mode before the entry. Isolated mode makes the worst case easier to say out loud: the margin on that position. Cross mode needs a look at every other position that shares the balance. XELORA’s risk notes use isolated math in the liquidation calculator so the box has a clear edge.',
        ],
      },
      {
        heading: 'A stop is the plan. Liquidation is the backstop.',
        paragraphs: [
          'A stop is a price you choose. Liquidation is a price the venue computes from margin and maintenance. Leave space between them. In a fast market a stop can fill worse than its price, so the space is a buffer, not a guarantee.',
          'If you cannot see both prices on the ticket, the order is early. Add margin, cut size, or widen nothing until both numbers are acceptable. The chart can wait.',
        ],
      },
    ],
  },
  {
    slug: 'before-you-sign',
    title: 'A checklist before you sign',
    summary: 'Eight lines to read on the ticket and in the wallet. The list is short on purpose. If one line is wrong, the signature waits.',
    track: 'Wallets',
    minutes: 7,
    image: '/blog/notes.jpg',
    imageAlt: 'Photograph of a hand writing in a notebook.',
    practice: { label: 'Review a swap quote', to: '/swap' },
    sourceLabel: 'Ethereum.org, ERC-20',
    sourceUrl: 'https://ethereum.org/en/developers/docs/standards/tokens/erc-20/',
    sections: [
      {
        heading: 'On the trading ticket',
        paragraphs: [
          'Confirm the market and the direction. Confirm the size in units and in quote currency. Confirm the order type: a market order takes the current book, a limit order waits. Confirm the stop, if the trade has one, and confirm that liquidation sits beyond it. Refresh a swap quote if it is more than a moment old. A stale quote is a different trade.',
          'Then confirm the fee you are about to accept, including the network fee the wallet will add. A small position on a busy chain can spend more on the fee than the idea was worth. Rejecting the prompt is a complete decision.',
        ],
      },
      {
        heading: 'In the wallet prompt',
        paragraphs: [
          'Match the asset, the amount, and the destination to the ticket. If the prompt is an approval rather than a swap, read the spender and the allowance. Token standards such as ERC-20 treat approval as its own transaction: you are granting a contract permission to move tokens later, up to the amount you set.',
          'An unlimited allowance is a standing permission. Use it only when you already trust that spender and you know how to revoke it. If the prompt asks for a recovery phrase, close it. Connection does not require that phrase, and no lesson on this site will ask you to type one in.',
        ],
      },
      {
        heading: 'After the signature',
        paragraphs: [
          'Record the plan you actually traded: market, size, stop, and the reason the idea expires. The journal on XELORA is the place for that note. A fill without a written invalidation becomes a position you manage by mood.',
          'These lessons are desk notes. They summarize public references and they are not instructions to buy or sell. The calculators will take your numbers. The wallet will take your signature. Both should wait until the checklist is clean.',
        ],
      },
    ],
  },
];

export const learnGlossary: Array<{ term: string; meaning: string }> = [
  { term: 'Bid', meaning: 'The highest price a buyer is currently willing to pay.' },
  { term: 'Ask', meaning: 'The lowest price a seller is currently willing to accept.' },
  { term: 'Spread', meaning: 'The gap between the best bid and the best ask.' },
  { term: 'Mark', meaning: 'A reference price venues use for margin and funding, often near spot.' },
  { term: 'Funding', meaning: 'A scheduled payment between longs and shorts on a perpetual.' },
  { term: 'Notional', meaning: 'The full value of a position, before leverage is applied.' },
  { term: 'Isolated margin', meaning: 'Collateral assigned to one position and unavailable to the others.' },
  { term: 'Allowance', meaning: 'A token amount a named contract is permitted to move later.' },
];

export function learnLesson(slug: string) {
  return learnLessons.find((lesson) => lesson.slug === slug);
}

export function learnVideo(id: string) {
  return learnVideos.find((video) => video.id === id);
}
