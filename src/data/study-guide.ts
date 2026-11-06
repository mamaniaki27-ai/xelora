import type { Course } from './course';

export const studyGuide: Course = {
  id: 'guide',
  base: '/guide',
  eyebrow: 'Guides & education',
  title: 'Where to read, and where to click',
  lede: 'Learn explains the ideas. The blog is the short desk notes. The trading guide is the ticket. The wallet guide is the signer. This page is the map between them, plus the controls that are easy to miss.',
  searchPlaceholder: 'Search navigation, favorites, learn, calculators',
  heroImage: '/blog/team.jpg',
  heroAlt: 'Overhead photograph of several people working on laptops around a shared table.',
  heroCaption: 'Photograph via Unsplash. The guides are notes for this interface, not a signal service.',
  tracks: ['Navigate', 'Study'],
  path: ['header-map', 'which-desk', 'first-session', 'what-the-notes-are'],
  videos: [
    {
      id: 'SSo_EIwHSd4',
      title: 'How does a blockchain work',
      channel: 'Simply Explained',
      note: 'Start here if the word “ledger” is still fuzzy, then open the Learn course.',
    },
    {
      id: 'kubGCSj5y3k',
      title: 'How Cryptocurrencies Actually Work',
      channel: 'SciShow',
      note: 'A short public tour of coins and why a price exists only when someone trades.',
    },
    {
      id: 'Tiyystl8x40',
      title: 'Understanding Market, Limit, and Stop Orders',
      channel: 'Charles Schwab',
      note: 'After the concepts, this is the lecture that matches the trading guide.',
    },
  ],
  terms: [
    { term: 'Learn', meaning: 'The course on coins, candles, funding, and position size.' },
    { term: 'Blog', meaning: 'Shorter notes with a source link and a photograph.' },
    { term: 'Trading guide', meaning: 'How the spot, futures, and swap screens behave.' },
    { term: 'Wallet guide', meaning: 'How the picker, the error, and a signature fit together.' },
    { term: 'Favorite', meaning: 'A market saved in this browser with the star.' },
    { term: 'Tools', meaning: 'Calculators. They return a number. They do not place an order.' },
  ],
  lessons: [
    {
      slug: 'header-map',
      title: 'How the header is organized',
      summary: 'Home, Markets, Spot, Futures, and Swap are direct links. Explore, Tools, and More open menus. The four guides live under More, and again in the footer.',
      track: 'Navigate',
      minutes: 6,
      image: '/blog/city.jpg',
      imageAlt: 'Photograph looking up at glass office towers against a cloudy sky.',
      practice: { label: 'Go to Markets', to: '/markets' },
      sourceLabel: 'XELORA trading guide',
      sourceUrl: '/how-to-trade',
      sections: [
        {
          heading: 'The row that always shows',
          paragraphs: [
            'On a wide screen the primary links are Home, Markets, Spot, Futures, and Swap, then Explore, Tools, and More. Explore holds the pulse, funding radar, screener, journal, referrals, announcements, and crypto prices. Tools holds the calculators, with the risk and funding ones listed by name.',
            'More holds Blog, Learn, Trading Guide, Wallet Guide, Guides & Education, then About, Xelo Token, and API Documentation. The same Learn column is in the footer, so you can reach these four pages from the bottom of any screen, including the terminals.',
          ],
        },
        {
          heading: 'What the right side does',
          paragraphs: [
            'The green Wallet button opens the connect gate when no address is stored, and the wallet page when one is. Connect Wallet opens the picker, or disconnects if you are already looking at a short address. The sun and moon icon switches theme for this browser.',
            'On a narrow screen those links collapse into the menu button. The groups keep the same names. A mint label is the page you are on.',
          ],
        },
      ],
    },
    {
      slug: 'search-and-the-star',
      title: 'Search, tags, and the favorite star',
      summary: 'Each list has its own search. The star on a market saves it here. Favorites is a filter on the market list, not a separate account.',
      track: 'Navigate',
      minutes: 6,
      image: '/blog/typing.jpg',
      imageAlt: 'Photograph of hands typing on a laptop keyboard at a wooden desk.',
      practice: { label: 'Open Markets', to: '/markets' },
      sourceLabel: 'XELORA markets',
      sourceUrl: '/markets',
      sections: [
        {
          heading: 'Search stays on the page you opened',
          paragraphs: [
            'Markets searches symbols. Learn searches lesson titles and summaries, and the track tabs narrow that further. The blog and the tools index do the same with their own boxes. A query on one page does not carry to the next. If a search comes back empty, clear it before you assume the page has no entries.',
            'Market tags and the Spot, Perpetual, and Favorites switches filter the same list the search is using. You can search inside a tab. Favorites shows only markets you have starred.',
          ],
        },
        {
          heading: 'The star is local',
          paragraphs: [
            'The star on a market row and the star beside the pair on the terminal write the same browser list. Clicking a gold star again removes it. Nothing is published, and a different browser starts with an empty list.',
            'The screener can also filter to favorites. Saving a market is a way to find it again. It is not a rating of the book and it is not a position.',
          ],
        },
      ],
    },
    {
      slug: 'which-desk',
      title: 'Which page answers which question',
      summary: 'Concepts, notes, the ticket, the signer, and the calculators are split on purpose. Open the page that matches the question instead of expecting one screen to teach all of it.',
      track: 'Study',
      minutes: 7,
      image: '/blog/collab.jpg',
      imageAlt: 'Photograph of two people talking across a table with a laptop and a notebook.',
      practice: { label: 'Open the learning center', to: '/learn' },
      sourceLabel: 'XELORA Learn',
      sourceUrl: '/learn',
      sections: [
        {
          heading: 'Five desks',
          paragraphs: [
            'Learn is the course: what a coin is, how a candle is built, how funding is arithmetic, and how a stop turns a loss budget into a size. Each lesson has a source link. Two of them include a public lecture. The blog is the shorter stack of notes, twenty of them, with photographs and the same kind of source line.',
            'The trading guide is the operating manual for Spot, Futures, and Swap, including the fact that submit stores a preview in this browser. The wallet guide is the operating manual for the picker, the error you see when a listed wallet does not finish connecting, and the rule about recovery phrases. Tools is where a formula returns a number you can compare with the ticket.',
          ],
        },
        {
          heading: 'How they point at each other',
          paragraphs: [
            'A trading lesson that needs a formula links the calculator. A wallet lesson that needs the concept of a key links the Learn article. This page links all four. You can start at either end: from a button you do not recognize, or from a word you want defined.',
            'Company pages such as About, fees, and status are references, not lessons. If a page says a feature is not connected, that sentence is the current behavior. The guides do not describe a venue order as if this front end had sent one.',
          ],
        },
      ],
    },
    {
      slug: 'first-session',
      title: 'A first session, in order',
      summary: 'Star a market, read the idea, run the size, open the terminal, and stop if liquidation is inside the move you care about. Submit only when you mean to store a preview.',
      track: 'Study',
      minutes: 8,
      image: '/blog/meeting.jpg',
      imageAlt: 'Photograph of a small team seated around a conference table with laptops.',
      practice: { label: 'Start the trading guide', to: '/how-to-trade' },
      sourceLabel: 'Investopedia, stop order',
      sourceUrl: 'https://www.investopedia.com/terms/s/stoporder.asp',
      sections: [
        {
          heading: 'Before the ticket',
          paragraphs: [
            'Open Markets and star one pair you can name without guessing the ticker. Open Learn and read the lesson that matches the question you actually have: candles if the chart is new, funding if you opened a perpetual, position size if you are about to type a number. Then open the position calculator and write down the unit size for a loss you can stand.',
            'That order keeps the terminal from being the place you invent a size. The percent buttons will happily fill 100% of the session balance, times leverage on a perpetual. The calculator will not.',
          ],
        },
        {
          heading: 'On the ticket',
          paragraphs: [
            'Open Spot or Futures for the pair you starred. Check the side, the order type, the size, and, on a perpetual, the leverage and the liquidation line. If liquidation sits inside the move you care about, change size or leverage before you touch submit.',
            'Submit stores the preview and says so under the button. Connect Wallet, if it appears instead, opens the picker described in the wallet guide. A new tab and an error mean the connection did not finish. The preview is still the only order this interface keeps.',
          ],
        },
      ],
      example: {
        title: 'One pass through the product',
        rows: [
          { label: '1', value: 'Markets → star a pair' },
          { label: '2', value: 'Learn → the lesson that matches the question' },
          { label: '3', value: 'Tools → position size from a stop' },
          { label: '4', value: 'Futures or Spot → compare liquidation with that stop' },
          { label: '5', value: 'Submit only to store a preview you have already checked' },
        ],
        note: 'Skip step 5 whenever the ticket disagrees with the calculator. The chart will still be there.',
      },
    },
    {
      slug: 'calculators-and-the-journal',
      title: 'Calculators, the journal, and the other lists',
      summary: 'A calculator is a form that updates from the numbers you type. The journal is where a closed note belongs. Pulse, funding, and the screener are other views of the same market list.',
      track: 'Study',
      minutes: 7,
      image: '/blog/documents.jpg',
      imageAlt: 'Photograph of a person signing a paper document with a pen.',
      practice: { label: 'Open all calculators', to: '/tools' },
      sourceLabel: 'XELORA tools',
      sourceUrl: '/tools',
      sections: [
        {
          heading: 'Numbers without an order',
          paragraphs: [
            'Profit, position size, liquidation, futures PnL, and funding are the calculators linked from the footer and from Tools. Each one states, under the form, that the result comes from the inputs on that page. Position size wants an account, a risk percent, an entry, and a stop. Funding wants a rate and a notional. None of them opens the wallet.',
            'Use them beside the ticket, not instead of reading it. If the ticket’s margin or liquidation disagrees with the calculator, find out which input differs before you store a preview.',
          ],
        },
        {
          heading: 'Notes and other boards',
          paragraphs: [
            'The journal is the page for a plan, a fill, and the reason a trade ended. A preview on the terminal is not a journal row until you record it there. Market pulse, the funding radar, and the screener are different cuts of the market list: movers, funding, and indicator-style filters including favorites.',
            'Announcements and referrals are present in the menu as their own pages. If one of them says it is not publishing or not tracking yet, that is the state of the preview. The education pages do not fill those in with invented campaigns.',
          ],
        },
      ],
    },
    {
      slug: 'what-the-notes-are',
      title: 'How these notes were written',
      summary: 'The byline is XELORA Research. The photographs are real. The lectures belong to their channels. None of it is an instruction to buy or sell.',
      track: 'Study',
      minutes: 6,
      image: '/blog/gold.jpg',
      imageAlt: 'Close-up photograph of stacked gold bars.',
      videoId: 'SSo_EIwHSd4',
      practice: { label: 'Open the blog', to: '/blog' },
      sourceLabel: 'Ethereum.org, wallets',
      sourceUrl: 'https://ethereum.org/en/wallets/',
      sections: [
        {
          heading: 'What you can trust the page to be',
          paragraphs: [
            'Lesson text is written for this interface and checked against the controls that are actually on the screen: the pair menu, the percent buttons, the leverage slider, the picker, the preview message. Where a definition comes from a public reference, the lesson links it. The link is the place to read the original. The lesson is a summary, not a copy.',
            'Photographs are credited as photographs. They show trading rooms, coins, desks, and documents. They are not charts of a live XELORA book, and a picture of a candle on a monitor is not a level to trade.',
          ],
        },
        {
          heading: 'What a lecture is for',
          paragraphs: [
            'YouTube players on Learn, the trading guide, the wallet guide, and this page load public videos from their authors: 3Blue1Brown, Simply Explained, SciShow, Wysetrade, TradingView, Charles Schwab, and Chainlink. Play one when you want the explanation in someone else’s voice. Then come back to the lesson for the control names this site uses.',
            'A lecture can show a demonstration recovery phrase. That phrase is not a default, not an example to import, and not something this site will accept in a form. The wallet guide is the page that says what to do instead.',
          ],
        },
      ],
    },
  ],
};
