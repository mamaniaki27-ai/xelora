<script setup lang="ts">
defineProps<{ id: string; size?: number; src?: string }>();
</script>

<template>
  <span class="inline-grid shrink-0 place-items-center overflow-hidden rounded-[12px]" :style="{ width: `${size ?? 40}px`, height: `${size ?? 40}px` }">
    <img v-if="src" :src="src" alt="" :width="size ?? 40" :height="size ?? 40" class="h-full w-full object-cover" loading="lazy" decoding="async" />
    <svg v-else :width="size ?? 40" :height="size ?? 40" viewBox="0 0 48 48" aria-hidden="true">
      <template v-if="id === 'walletconnect'">
        <rect width="48" height="48" rx="12" fill="#3B99FC" />
        <g transform="translate(8 10) scale(1.35)">
          <path fill="#fff" d="M4.913 7.519c3.915-3.831 10.26-3.831 14.174 0l.471.461a.483.483 0 0 1 0 .694l-1.611 1.577a.252.252 0 0 1-.354 0l-.649-.634c-2.73-2.673-7.157-2.673-9.887 0l-.694.68a.255.255 0 0 1-.355 0L4.397 8.719a.482.482 0 0 1 0-.693l.516-.507Zm17.506 3.263 1.434 1.404a.483.483 0 0 1 0 .694l-6.466 6.331a.508.508 0 0 1-.709 0l-4.588-4.493a.126.126 0 0 0-.178 0l-4.589 4.493a.508.508 0 0 1-.709 0L.147 12.88a.483.483 0 0 1 0-.694l1.434-1.404a.508.508 0 0 1 .709 0l4.589 4.493c.05.048.129.048.178 0l4.589-4.493a.508.508 0 0 1 .709 0l4.589 4.493c.05.048.128.048.178 0l4.589-4.493a.507.507 0 0 1 .708 0Z" />
        </g>
      </template>
      <template v-else-if="id === 'phantom'">
        <rect width="48" height="48" rx="12" fill="#AB9FF2" />
        <path fill="#fff" d="M34.4 23.2c0-6.8-3.8-11-9.8-11s-10 4.2-10 11.2V32c0 1.5.8 2.3 1.9 2.3.9 0 1.5-.5 1.9-1.3.5.9 1.3 1.5 2.4 1.5 1.2 0 2-.8 2.5-1.6.6.9 1.5 1.6 2.7 1.6 1.3 0 2.1-.8 2.5-1.7.5.9 1.4 1.7 2.5 1.7 1.3 0 2.1-1 2.1-2.4v-8.9h1.3Z" />
        <ellipse cx="20.4" cy="22.6" rx="1.7" ry="2.05" fill="#3A2A86" />
        <ellipse cx="26.8" cy="22.6" rx="1.7" ry="2.05" fill="#3A2A86" />
      </template>
      <template v-else-if="id === 'trust'">
        <rect width="48" height="48" rx="12" fill="#0500FF" />
        <path fill="#fff" d="M24 7.5 12.5 12v10.6C12.5 30.4 17.4 35.4 24 37.8 30.6 35.4 35.5 30.4 35.5 22.6V12L24 7.5Z" />
        <path fill="#0500FF" d="M24 13.6 18 16.2v6.8c0 4.2 2.6 6.8 6 8 3.4-1.2 6-3.8 6-8v-6.8L24 13.6Z" />
        <path fill="#fff" d="M24 18.4c1.9 1.4 3.1 2.5 4 4.1-1 .8-2.4 1.3-4 1.3s-3-.5-4-1.3c.9-1.6 2.1-2.7 4-4.1Z" />
      </template>
      <template v-else-if="id === 'my-wallet'">
        <rect width="48" height="48" rx="12" fill="#1A73E8" />
        <path fill="#fff" d="M15 13h5.4c.8 2.6.8 5.4 0 8H15V13Zm7.2 0H33v3.4h-6.6V13Zm0 5.6H33v3.4h-6.6v-3.4ZM15 24h18v8.4c0 1.5-1.2 2.6-2.6 2.6H17.6c-1.4 0-2.6-1.1-2.6-2.6V24Z" />
      </template>
      <template v-else-if="id === 'binance'">
        <rect width="48" height="48" rx="12" fill="#1E2329" />
        <path fill="#F3BA2F" d="m24 11 4.4 4.4L24 19.8 19.6 15.4 24 11Zm-8.6 8.6L19.8 24l-4.4 4.4L11 24l4.4-4.4Zm17.2 0L37 24l-4.4 4.4L28.2 24l4.4-4.4ZM24 20.6 28.4 25 24 29.4 19.6 25 24 20.6Zm0 8.8 4.4 4.4L24 38l-4.4-4.2L24 29.4Z" />
      </template>
      <template v-else-if="id === 'safepal'">
        <rect width="48" height="48" rx="12" fill="#4A21EF" />
        <path fill="#fff" d="M15 14h18v5.4h-6.4V23H33v5.4h-6.4V36h-5.2v-7.6H15V23h6.4v-3.6H15V14Z" />
      </template>
      <template v-else-if="id === 'tokenpocket'">
        <rect width="48" height="48" rx="12" fill="#2980FE" />
        <text x="8" y="32" fill="#fff" font-size="18" font-family="Arial, sans-serif" font-weight="700">TP</text>
      </template>
      <template v-else-if="id === 'ironwallet'">
        <rect width="48" height="48" rx="12" fill="#245BFF" />
        <text x="10" y="33" fill="#fff" font-size="24" font-family="Arial, sans-serif" font-weight="700">W</text>
      </template>
      <template v-else-if="id === 'fireblocks'">
        <rect width="48" height="48" rx="12" fill="#2454FF" />
        <path fill="#fff" d="M24 11 37 37H11L24 11Zm0 9.2L17.6 33h12.8L24 20.2Z" />
      </template>
      <template v-else-if="id === 'bitget'">
        <rect width="48" height="48" rx="12" fill="#00D6C9" />
        <path fill="#062026" d="M14 15h18.5l-7.2 9.2H33L20.5 37 23 24.2h-6.2L14 15Z" />
      </template>
      <template v-else-if="id === 'okx'">
        <rect width="48" height="48" rx="12" fill="#111111" />
        <path fill="#fff" d="M11 11h8v8h-8V11Zm18 0h8v8h-8V11ZM20 20h8v8h-8v-8ZM11 29h8v8h-8v-8Zm18 0h8v8h-8v-8Z" />
      </template>
      <template v-else-if="id === 'frame'">
        <rect width="48" height="48" rx="12" fill="#111111" />
        <path fill="#fff" d="M14 16v8h4v-4h4v-4H14Zm20 0h-8v4h4v4h4V16ZM18 32v-4h-4v-4h-4v8h8Zm12 0h8v-8h-4v4h-4v4Z" />
      </template>
      <template v-else-if="id === 'uniswap'">
        <rect width="48" height="48" rx="12" fill="#FC72FF" />
        <path fill="#fff" d="M24 9c2.4 2.8 3.8 5.2 3.8 8.2 0 1.8-.5 3-1.4 4.2 2.6.4 4.6 1.8 6 4 1.8 2.8 1.3 6.8-1.4 9-2.2 1.8-5.2 1.8-7 0-1.8 1.8-4.8 1.8-7 0-2.7-2.2-3.2-6.2-1.4-9 1.4-2.2 3.4-3.6 6-4-.9-1.2-1.4-2.4-1.4-4.2 0-3 1.4-5.4 3.8-8.2Zm0 6.2c-.9 1.2-1.4 2.2-1.4 3.6 0 .9.5 1.6 1.4 2.2.9-.6 1.4-1.3 1.4-2.2 0-1.4-.5-2.4-1.4-3.6Z" />
        <circle cx="21.2" cy="20.4" r="1.1" fill="#FC72FF" />
        <circle cx="26.6" cy="20.4" r="1.1" fill="#FC72FF" />
      </template>
      <template v-else-if="id === 'coinbase'">
        <rect width="48" height="48" rx="12" fill="#0052FF" />
        <rect x="14" y="14" width="20" height="20" rx="10" fill="none" stroke="#fff" stroke-width="3.5" />
      </template>
      <template v-else-if="id === 'rainbow'">
        <rect width="48" height="48" rx="12" fill="#0C0C0D" />
        <path fill="none" stroke="#FF4000" stroke-width="3" stroke-linecap="round" d="M11 32c4-9 9.5-13 13-13s9 4 13 13" />
        <path fill="none" stroke="#FFD000" stroke-width="3" stroke-linecap="round" d="M14 32c3.2-6.6 7.6-9.6 10-9.6S30.8 25.4 34 32" />
        <path fill="none" stroke="#00E676" stroke-width="3" stroke-linecap="round" d="M17 32c2.4-4.4 5.4-6.4 7-6.4s4.6 2 7 6.4" />
        <path fill="none" stroke="#2979FF" stroke-width="3" stroke-linecap="round" d="M20 32c1.6-2.6 3.2-3.8 4-3.8s2.4 1.2 4 3.8" />
      </template>
      <template v-else>
        <rect width="48" height="48" rx="12" fill="#3478F6" />
        <rect x="11" y="16" width="26" height="18" rx="3" fill="#fff" />
        <path fill="#3478F6" d="M26 21h11v7H26a3.5 3.5 0 0 1 0-7Z" />
        <circle cx="29.2" cy="24.5" r="1.2" fill="#fff" />
      </template>
    </svg>
  </span>
</template>
