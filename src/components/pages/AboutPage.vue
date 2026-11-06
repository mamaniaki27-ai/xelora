<script setup lang="ts">
import { RouterLink } from 'vue-router';
import VideoFrame from '../learn/VideoFrame.vue';

const surfaces = [
  { label: 'Markets', to: '/markets', text: 'Search the book, filter spot and perpetuals, and star a pair in this browser.' },
  { label: 'Spot and futures', to: '/futures', text: 'Candles, the order book, and a ticket that stores a preview order on this device.' },
  { label: 'Swap', to: '/swap', text: 'Pay and receive are chosen separately. Refresh the quote before a wallet is asked to sign.' },
  { label: 'Learn', to: '/learn', text: 'Lessons on coins, candles, funding, and position size, with public lectures.' },
];

const points = [
  { title: 'Keys stay in the wallet', body: 'XELORA prepares a market, a size, and a quote. The wallet holds the key and produces any signature. The recovery phrase is never a field on this site.' },
  { title: 'A submit is a preview', body: 'The terminal writes “Preview order stored in this browser.” That row is not sent to Hyperliquid or any other venue.' },
  { title: 'One market list', body: 'Spot, futures, swap, pulse, and the calculators read the same symbols, prices, and funding figures.' },
  { title: 'Xelo is pre-launch', body: 'The token page states a max supply and marks the contract as not yet announced. No address is invented to fill the blank.' },
];
</script>

<template>
  <section class="mx-auto w-full max-w-6xl px-4 py-10">
    <p class="text-xs font-bold uppercase tracking-[0.18em] text-mint">About</p>
    <h1 class="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">A wallet-first front end for spot, futures, and swaps</h1>
    <p class="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
      XELORA is the interface: the market list, the ticket, the swap, the calculators, and the notes. Assets stay in the wallet you connect. This page is the account of what that interface does today.
    </p>

    <figure class="panel mt-8 overflow-hidden">
      <img src="/blog/city.jpg" alt="Photograph looking up at glass office towers against a cloudy sky." class="max-h-[420px] w-full object-cover" />
      <figcaption class="px-4 py-3 text-[11px] text-muted">Photograph via Unsplash. The product is the screen you trade from, not a balance held by XELORA.</figcaption>
    </figure>

    <div class="mt-10 grid gap-5 lg:grid-cols-2">
      <article class="panel overflow-hidden">
        <img src="/blog/exchange.jpg" alt="Photograph of a laptop screen showing a candlestick chart in a dark room." class="h-52 w-full object-cover" />
        <div class="p-5">
          <h2 class="text-xl font-semibold">What the screen is for</h2>
          <div class="mt-3 space-y-3 text-sm leading-7 text-ink/90">
            <p>
              A non-custodial front end shows a book and asks a signer to approve a specific payload. It does not take deposits, and it does not keep a recovery phrase on a server. XELORA is built in that shape: Markets to find a pair, Spot and Futures to read the chart and the ticket, Swap to price one asset in another.
            </p>
            <p>
              The header also opens Explore, Tools, and More. Explore is the pulse, funding radar, screener, and journal. Tools is the calculators. More holds the blog, the learning center, the trading guide, the wallet guide, and this page. The same links sit in the footer on every route, including the terminals.
            </p>
          </div>
        </div>
      </article>
      <article class="panel overflow-hidden">
        <img src="/blog/keyboard.jpg" alt="Photograph of a desk with a laptop, an external monitor, and a phone." class="h-52 w-full object-cover" />
        <div class="p-5">
          <h2 class="text-xl font-semibold">Where the key lives</h2>
          <div class="mt-3 space-y-3 text-sm leading-7 text-ink/90">
            <p>
              Connect Wallet opens a picker over a blurred page. Choosing a listed wallet opens that wallet’s site in a new tab and this page reports that the connection did not complete. An address, once stored, is what the wallet page and the ticket use. Disconnect clears it.
            </p>
            <p>
              A signature, when a wallet asks for one, is a yes to the asset, the amount, and the destination in that prompt. An approval is a separate yes: permission for a contract to move a token later. Neither request is a reason to type a recovery phrase into a page. The wallet guide is the longer version of that rule.
            </p>
          </div>
        </div>
      </article>
    </div>

    <div class="mt-5 grid gap-4 sm:grid-cols-2">
      <article v-for="point in points" :key="point.title" class="panel p-4">
        <h2 class="font-semibold">{{ point.title }}</h2>
        <p class="mt-2 text-sm leading-relaxed text-muted">{{ point.body }}</p>
      </article>
    </div>

    <div class="mt-10">
      <h2 class="text-2xl font-semibold">Open a surface</h2>
      <div class="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <RouterLink v-for="item in surfaces" :key="item.to" :to="item.to" class="panel p-4 transition hover:border-mint/40">
          <h3 class="font-semibold">{{ item.label }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-muted">{{ item.text }}</p>
        </RouterLink>
      </div>
    </div>

    <div class="mt-12 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-mint">Watch</p>
        <h2 class="mt-2 text-2xl font-semibold">Why a signature can move a balance</h2>
        <p class="mt-2 text-sm leading-relaxed text-muted">
          3Blue1Brown’s lecture is a public explanation of keys and a shared ledger. XELORA did not produce it. It is here because the product is built on that split: the site can show the market, and only the key can authorize a change.
        </p>
        <div class="mt-4">
          <VideoFrame id="bBC-nXj3Ng4" title="But how does bitcoin actually work? by 3Blue1Brown" />
        </div>
      </div>
      <article class="panel overflow-hidden">
        <img src="/blog/notes.jpg" alt="Photograph of a hand writing in a notebook." class="h-44 w-full object-cover" />
        <div class="p-5">
          <h2 class="text-lg font-semibold">Notes, not a desk you write to</h2>
          <p class="mt-2 text-sm leading-relaxed text-muted">
            Lessons are signed XELORA Research and link the public source they summarize. Photographs are real. The journal is where a trade note stays, on this device. The blog is the shorter stack of the same kind of note.
          </p>
          <div class="mt-4 flex flex-wrap gap-2">
            <RouterLink to="/learn" class="mint-btn">Learning center</RouterLink>
            <RouterLink to="/blog" class="ghost-btn">Blog</RouterLink>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
