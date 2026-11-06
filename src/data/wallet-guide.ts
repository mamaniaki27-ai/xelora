import type { Course } from './course';

export const walletGuide: Course = {
  id: 'how-to-use-wallet',
  base: '/how-to-use-wallet',
  eyebrow: 'Wallet guide',
  title: 'How a wallet meets this site',
  lede: 'XELORA can ask a wallet to connect and, later, to sign. It cannot see a recovery phrase, and the picker does not become a successful connection just because a wallet was selected.',
  searchPlaceholder: 'Search connect, signature, recovery phrase, disconnect',
  heroImage: '/blog/keyboard.jpg',
  heroAlt: 'Photograph of a desk with a laptop, an external monitor, and a phone.',
  heroCaption: 'Photograph via Unsplash. The signer lives in the wallet, not in the trading page.',
  tracks: ['Connect', 'Review', 'Safety'],
  path: ['open-the-picker', 'what-the-list-does', 'read-a-prompt', 'the-phrase-stays-offline'],
  videos: [
    {
      id: 'bBC-nXj3Ng4',
      title: 'But how does bitcoin actually work?',
      channel: '3Blue1Brown',
      note: 'Why a signature can move a balance without handing the key to the website.',
    },
    {
      id: 'D8OMlCP_e-M',
      title: 'How to Self-Custody Crypto',
      channel: 'Chainlink',
      note: 'A walk through Ledger, MetaMask, and Trezor. Any phrase shown in a lecture belongs to that demonstration, not to you.',
    },
    {
      id: 'uI2NpkiUKsQ',
      title: 'How To Connect a Hardware Wallet to MetaMask',
      channel: 'Chainlink',
      note: 'The hardware device signs. The browser wallet only prepares the request.',
    },
  ],
  terms: [
    { term: 'Address', meaning: 'The public account a wallet can share. It is safe to display. It cannot spend.' },
    { term: 'Signature', meaning: 'A yes to one payload. The key that made it stays in the wallet.' },
    { term: 'Recovery phrase', meaning: 'A backup of the key. Anyone who reads it can recreate the wallet.' },
    { term: 'Allowance', meaning: 'Permission for a contract to move a token later, up to a limit you set.' },
    { term: 'Picker', meaning: 'The wallet list that opens over the blurred page.' },
    { term: 'Disconnect', meaning: 'Clears the address stored for this browser session.' },
  ],
  lessons: [
    {
      slug: 'open-the-picker',
      title: 'Where Connect Wallet opens',
      summary: 'The header, the swap card, the wallet page, and the terminal submit button all open the same picker when no address is stored. The green Wallet button opens a gate first.',
      track: 'Connect',
      minutes: 6,
      image: '/blog/presenter.jpg',
      imageAlt: 'Photograph of a person typing on a tablet keyboard at a small table.',
      practice: { label: 'Open the wallet page', to: '/wallet' },
      sourceLabel: 'Ethereum.org, wallets',
      sourceUrl: 'https://ethereum.org/en/wallets/',
      sections: [
        {
          heading: 'Two header controls',
          paragraphs: [
            'Connect Wallet, the ghost button, opens the picker directly when nothing is connected. The green Wallet button opens a full-screen gate that says a wallet is required, with its own Connect Wallet button into the same picker. If an address is already stored, Wallet goes to the wallet page and the ghost button shows a short address with a mint dot. Clicking that address disconnects.',
            'The page behind the picker is dimmed and blurred. The dialog itself stays sharp. Escape from the full wallet catalog returns to the short list. Escape from the short list closes the picker.',
          ],
        },
        {
          heading: 'The same door on the other pages',
          paragraphs: [
            'Swap, the empty wallet page, and the terminal submit button call this picker when there is no session address. You do not get a different wallet on a different page. Ethereum.org’s wallet pages describe the signer as the thing that holds the key. This site is the thing that asks.',
            'Connecting, when it succeeds, shares an address so balances and preview tickets can show a name. It is not a transfer and it is not an approval.',
          ],
        },
      ],
    },
    {
      slug: 'what-the-list-does',
      title: 'What happens when you pick a wallet',
      summary: 'Choosing a listed wallet opens that wallet’s site in a new tab. This page then shows an error: the wallet could not complete the connection. The list is a handoff, not a finished login.',
      track: 'Connect',
      minutes: 7,
      image: '/blog/typing.jpg',
      imageAlt: 'Photograph of hands typing on a laptop keyboard at a wooden desk.',
      practice: { label: 'Review the trading ticket first', to: '/how-to-trade' },
      sourceLabel: 'WalletConnect, wallets',
      sourceUrl: 'https://walletconnect.com/',
      sections: [
        {
          heading: 'The short list and the full catalog',
          paragraphs: [
            'The picker leads with WalletConnect, MetaMask, Phantom, My Wallet, and Trust Wallet, then a search box and a count that opens every wallet in the catalog. Logos come from the WalletConnect registry. Search filters that catalog by name. The count beside the directory matches the number of rows.',
            'Installed badges on MetaMask and Phantom mark wallets a browser often already has. They do not mean this page has already linked them.',
          ],
        },
        {
          heading: 'A click opens their site and reports the miss',
          paragraphs: [
            'Selecting a wallet calls its homepage in a new tab and sets the message “{Name} could not complete the connection.” You see that both as a banner on the page and inside the dialog. The session address does not change because of that click.',
            'On the wallet’s own site, stop if a form asks for a recovery phrase, a private key, or a password from this trading page. XELORA will not ask for those, and a connection that failed here is not repaired by typing them somewhere else.',
          ],
        },
      ],
      example: {
        title: 'After you choose MetaMask',
        rows: [
          { label: 'New tab', value: 'https://metamask.io/' },
          { label: 'This page', value: 'MetaMask could not complete the connection.' },
          { label: 'Stored address', value: 'Unchanged' },
          { label: 'Phrase field on XELORA', value: 'There is not one' },
        ],
        note: 'The same pattern applies to every other listed wallet. The name in the error is the name you clicked.',
      },
    },
    {
      slug: 'read-a-prompt',
      title: 'Read the prompt before you sign',
      summary: 'A wallet prompt is the real confirmation. Match the asset, the amount, and the destination to the ticket. An approval is a second kind of yes: it lets a contract move tokens later.',
      track: 'Review',
      minutes: 8,
      image: '/blog/documents.jpg',
      imageAlt: 'Photograph of a person signing a paper document with a pen.',
      practice: { label: 'Read the checklist lesson', to: '/learn/before-you-sign' },
      sourceLabel: 'Ethereum.org, ERC-20',
      sourceUrl: 'https://ethereum.org/en/developers/docs/standards/tokens/erc-20/',
      sections: [
        {
          heading: 'Three lines that have to match',
          paragraphs: [
            'When a wallet does ask for a signature, the details that matter are the asset, the amount, and where it is going. Read them on the wallet’s own screen, including a hardware device’s screen if you use one. The trading page can be wrong, stale, or showing a different quote than the one in the prompt.',
            'Reject the prompt if any line disagrees with the ticket. A rejected signature does not need a follow-up message to support. Closing it is the whole action.',
          ],
        },
        {
          heading: 'Approvals are not swaps',
          paragraphs: [
            'Token contracts in the ERC-20 pattern split a transfer from an approval. The approval names a spender and an allowance. Later that spender can pull tokens up to the allowance without a new confirmation for each unit. An unlimited allowance is a standing permission.',
            'If you do not recognize the spender, do not sign. The Learn lesson on the checklist walks the same pause in the order the ticket uses: market, size, quote, then the wallet.',
          ],
        },
      ],
    },
    {
      slug: 'the-phrase-stays-offline',
      title: 'The recovery phrase never belongs in a page',
      summary: 'A phrase recreates the wallet. A password unlocks an app on one device. A signature approves one payload. Only the third thing should ever be requested by a trading screen.',
      track: 'Safety',
      minutes: 8,
      image: '/blog/security.jpg',
      imageAlt: 'Photograph of a person holding a bank card while typing on a laptop.',
      videoId: 'D8OMlCP_e-M',
      practice: { label: 'Open the wallet lesson in Learn', to: '/learn/keys-and-wallets' },
      sourceLabel: 'MetaMask, recovery phrase',
      sourceUrl: 'https://support.metamask.io/getting-started/user-guide-secret-recovery-phrase-password-and-private-keys/',
      sections: [
        {
          heading: 'Three secrets, three jobs',
          paragraphs: [
            'MetaMask’s own guide separates the secret recovery phrase, the password, and a private key. The phrase derives the accounts. The password unlocks the app on that device. The key signs. A website that has the phrase has the wallet. A website that receives a signature has a yes to one request.',
            'XELORA has no field for a phrase, a key, or the wallet password. Anyone in a chat, an email, or a support thread who asks for those is not completing a connection. Close the thread.',
          ],
        },
        {
          heading: 'Lectures that show a phrase',
          paragraphs: [
            'Some setup videos display a recovery phrase because the presenter is creating a demonstration wallet they intend to throw away. Those words are not a sample you can reuse, and they are not something to pause on and type. Write your own phrase only inside the wallet that created it, on paper or another offline backup.',
            'A hardware wallet keeps the key on the device and asks you to confirm the amount and destination on its screen. The Chainlink lecture on connecting a hardware wallet to a browser wallet shows that split. The browser prepares the request. The device signs it.',
          ],
        },
      ],
    },
    {
      slug: 'when-an-address-is-stored',
      title: 'What the wallet page shows',
      summary: 'With an address stored, the page shows Connected, the account, a USDC balance of 12,500.00, ETH when the injected wallet returns it, and the preview orders from this browser.',
      track: 'Review',
      minutes: 6,
      image: '/blog/office.jpg',
      imageAlt: 'Photograph of a long office hallway with glass meeting rooms.',
      practice: { label: 'Open the wallet page', to: '/wallet' },
      sourceLabel: 'Ethereum.org, wallets',
      sourceUrl: 'https://ethereum.org/en/wallets/',
      sections: [
        {
          heading: 'The session screen',
          paragraphs: [
            'The status line reads Connected, and the wallet name when one was stored with the address. The account is the full address. USDC is shown as 12,500.00 so the rest of the interface has an available amount to quote. ETH is read from an injected wallet when that wallet answers. If it does not, the page shows 4.820000.',
            'Status reads Operational for the front end. History lists preview orders saved from the terminal: pair, side, size, and price. An empty history means no preview has been stored in this browser.',
          ],
        },
        {
          heading: 'Disconnect',
          paragraphs: [
            'Disconnect is on the wallet page and on the header once the short address is showing. It clears the stored address and the wallet name. Preview orders already written can remain in the trade history until that browser data is cleared. Disconnect does not move funds, because this front end does not hold them.',
            'Opening the picker again after a disconnect starts from the same list. A previous error banner does not mean the address is still connected.',
          ],
        },
      ],
    },
    {
      slug: 'if-the-connection-fails',
      title: 'If the connection fails',
      summary: 'The error is the result. Leave the phrase where it is, close the extra tab if the site is asking for it, and open the picker again only when you mean to try a different wallet.',
      track: 'Safety',
      minutes: 6,
      image: '/blog/notes.jpg',
      imageAlt: 'Photograph of a hand writing in a notebook.',
      practice: { label: 'Back to all lessons', to: '/how-to-use-wallet' },
      sourceLabel: 'MetaMask, getting started',
      sourceUrl: 'https://support.metamask.io/getting-started/getting-started-with-metamask',
      sections: [
        {
          heading: 'Read the banner, then stop',
          paragraphs: [
            '“Could not complete the connection” means this page did not receive a usable session from that click. It is shown twice so it is hard to miss: once over the page and once in the dialog. Do not answer it by searching for a seed-phrase box.',
            'A wallet vendor’s site is the right place to install or unlock their own app. It is the wrong place to paste a phrase because a trading page told you the connection failed. Install only from the vendor you meant to open, then return here and open the picker again if you still want to try.',
          ],
        },
        {
          heading: 'What stays put',
          paragraphs: [
            'A failed choice does not erase an address that was already stored, and it does not create one. The terminal, the swap, and the wallet page keep behaving as they did before the click. Preview orders are untouched.',
            'If the injected wallet itself rejects a later signature, that rejection is also final for that prompt. Change the ticket, refresh the quote, and request a new signature only when the new payload is the one you want.',
          ],
        },
      ],
    },
  ],
};
