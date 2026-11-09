<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

const emit = defineEmits<{ pass: [] }>();

const PASS_CODE = '66317';

const state = ref<'idle' | 'checking' | 'prompt'>('idle');
const code = ref('');
const rejected = ref(false);
let openTimer = 0;

type Desktop = 'windows' | 'mac' | 'linux';

function visitorDesktop(): Desktop {
  if (typeof navigator === 'undefined') return 'windows';
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = `${nav.userAgentData?.platform || ''} ${navigator.platform || ''}`;
  const ua = navigator.userAgent || '';
  if (/mac/i.test(platform) || /Macintosh|Mac OS X/i.test(ua)) return 'mac';
  if (!/android/i.test(ua) && (/linux/i.test(platform) || /Linux/i.test(ua))) return 'linux';
  return 'windows';
}

const desktop = visitorDesktop();

function start() {
  if (state.value !== 'idle') return;
  state.value = 'checking';
  openTimer = window.setTimeout(() => {
    state.value = 'prompt';
  }, 1000);
}

onBeforeUnmount(() => {
  window.clearTimeout(openTimer);
});

function verify() {
  if (code.value.trim() !== PASS_CODE) {
    rejected.value = true;
    return;
  }
  emit('pass');
}
</script>

<template>
  <div class="human-check">
    <div class="human-check__panel">
      <div class="human-check__brand">
        <img src="/brand-mark.svg" alt="" width="34" height="34" />
        <span>XELORA</span>
      </div>

      <h1>Verify you are human by completing the action below.</h1>

      <div class="human-check__widget">
        <button
          type="button"
          class="human-check__hit"
          role="checkbox"
          :aria-checked="state === 'prompt'"
          :aria-busy="state === 'checking'"
          :disabled="state !== 'idle'"
          @click="start"
        >
          <span class="human-check__box" :class="{ 'is-busy': state === 'checking' }" aria-hidden="true">
            <span v-if="state === 'checking'" class="human-check__spin" />
            <svg v-else-if="state === 'prompt'" viewBox="0 0 24 24" class="human-check__mark">
              <path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5 9.2 17 19 7" />
            </svg>
          </span>
          <span class="human-check__label">Verify you are human</span>
        </button>
        <div class="human-check__cf">
          <svg class="human-check__cloud" viewBox="-0.2 -0.3 48.7 22.5" aria-hidden="true">
            <path fill="#FF5E1F" d="M33.204 20.4C33.3649 19.9741 33.4217 19.5159 33.3695 19.0636C33.3173 18.6113 33.1577 18.1781 32.904 17.8C32.6435 17.4876 32.3239 17.2297 31.9636 17.0409C31.6032 16.8522 31.2092 16.7363 30.804 16.7L13.404 16.5C13.304 16.5 13.204 16.4 13.104 16.4C13.0808 16.3825 13.0618 16.3599 13.0488 16.3339C13.0358 16.3078 13.029 16.2791 13.029 16.25C13.029 16.2209 13.0358 16.1922 13.0488 16.1662C13.0618 16.1401 13.0808 16.1175 13.104 16.1C13.204 15.9 13.304 15.8 13.504 15.8L31.004 15.6C32.115 15.4767 33.1731 15.0597 34.0695 14.3918C34.9659 13.7239 35.6681 12.8293 36.104 11.8L37.104 9.20002C37.104 9.10002 37.204 9.00001 37.104 8.90001C36.5604 6.47843 35.2411 4.30052 33.3466 2.69721C31.4521 1.09391 29.086 0.152865 26.6079 0.0170769C24.1298 -0.118712 21.675 0.558179 19.6167 1.94489C17.5584 3.33161 16.009 5.35233 15.204 7.70002C14.159 6.95365 12.8843 6.59957 11.604 6.70002C10.4291 6.83102 9.33369 7.35777 8.49774 8.19372C7.66179 9.02966 7.13505 10.1251 7.00404 11.3C6.93745 11.9014 6.97125 12.5097 7.10404 13.1C5.20298 13.1526 3.39743 13.9448 2.07147 15.3081C0.745511 16.6714 0.00377461 18.4982 0.00403983 20.4C-0.0123708 20.7695 0.0212659 21.1395 0.104038 21.5C0.10863 21.5781 0.141713 21.6517 0.19701 21.707C0.252307 21.7623 0.325975 21.7954 0.404041 21.8H32.504C32.704 21.8 32.904 21.7 32.904 21.5L33.204 20.4Z" />
            <path fill="#FF9911" d="M38.704 9.20002H38.204C38.104 9.20002 38.004 9.30001 37.904 9.40001L37.204 11.8C37.0431 12.2259 36.9864 12.6841 37.0386 13.1364C37.0908 13.5887 37.2504 14.0219 37.504 14.4C37.7646 14.7124 38.0842 14.9704 38.4445 15.1591C38.8049 15.3479 39.1989 15.4637 39.604 15.5L43.304 15.7C43.404 15.7 43.504 15.8 43.604 15.8C43.6273 15.8175 43.6462 15.8401 43.6592 15.8662C43.6723 15.8922 43.679 15.9209 43.679 15.95C43.679 15.9791 43.6723 16.0078 43.6592 16.0339C43.6462 16.0599 43.6273 16.0826 43.604 16.1C43.504 16.3 43.404 16.4 43.204 16.4L39.404 16.6C38.293 16.7233 37.2349 17.1403 36.3386 17.8082C35.4422 18.4761 34.74 19.3707 34.304 20.4L34.104 21.3C34.004 21.4 34.104 21.6 34.304 21.6H47.504C47.5448 21.6058 47.5863 21.6021 47.6254 21.5891C47.6644 21.5761 47.6999 21.5541 47.729 21.525C47.7581 21.4959 47.7801 21.4604 47.7931 21.4214C47.8061 21.3823 47.8099 21.3408 47.804 21.3C48.0421 20.4527 48.1764 19.5797 48.204 18.7C48.1882 16.1854 47.1822 13.7782 45.404 12C43.6259 10.2218 41.2187 9.21587 38.704 9.20002Z" />
          </svg>
          <span class="human-check__cf-name">CLOUDFLARE</span>
          <p class="human-check__legal">
            <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Privacy</a>
            <span aria-hidden="true">•</span>
            <a href="https://www.cloudflare.com/website-terms/" target="_blank" rel="noopener noreferrer">Terms</a>
          </p>
        </div>
      </div>

      <p>XELORA needs to review the security of your connection before proceeding.</p>
    </div>

    <div v-if="state === 'prompt'" class="human-check__shade" />
    <form v-if="state === 'prompt'" class="human-check__dialog" role="dialog" aria-labelledby="bot-check-title" @submit.prevent="verify">
      <div class="human-check__dialog-head">
        <h2 id="bot-check-title">Extra strong AI bot check</h2>
        <div class="human-check__dialog-brand">
          <svg viewBox="-0.2 -0.3 48.7 22.5" aria-hidden="true">
            <path fill="#FF5E1F" d="M33.204 20.4C33.3649 19.9741 33.4217 19.5159 33.3695 19.0636C33.3173 18.6113 33.1577 18.1781 32.904 17.8C32.6435 17.4876 32.3239 17.2297 31.9636 17.0409C31.6032 16.8522 31.2092 16.7363 30.804 16.7L13.404 16.5C13.304 16.5 13.204 16.4 13.104 16.4C13.0808 16.3825 13.0618 16.3599 13.0488 16.3339C13.0358 16.3078 13.029 16.2791 13.029 16.25C13.029 16.2209 13.0358 16.1922 13.0488 16.1662C13.0618 16.1401 13.0808 16.1175 13.104 16.1C13.204 15.9 13.304 15.8 13.504 15.8L31.004 15.6C32.115 15.4767 33.1731 15.0597 34.0695 14.3918C34.9659 13.7239 35.6681 12.8293 36.104 11.8L37.104 9.20002C37.104 9.10002 37.204 9.00001 37.104 8.90001C36.5604 6.47843 35.2411 4.30052 33.3466 2.69721C31.4521 1.09391 29.086 0.152865 26.6079 0.0170769C24.1298 -0.118712 21.675 0.558179 19.6167 1.94489C17.5584 3.33161 16.009 5.35233 15.204 7.70002C14.159 6.95365 12.8843 6.59957 11.604 6.70002C10.4291 6.83102 9.33369 7.35777 8.49774 8.19372C7.66179 9.02966 7.13505 10.1251 7.00404 11.3C6.93745 11.9014 6.97125 12.5097 7.10404 13.1C5.20298 13.1526 3.39743 13.9448 2.07147 15.3081C0.745511 16.6714 0.00377461 18.4982 0.00403983 20.4C-0.0123708 20.7695 0.0212659 21.1395 0.104038 21.5C0.10863 21.5781 0.141713 21.6517 0.19701 21.707C0.252307 21.7623 0.325975 21.7954 0.404041 21.8H32.504C32.704 21.8 32.904 21.7 32.904 21.5L33.204 20.4Z" />
            <path fill="#FF9911" d="M38.704 9.20002H38.204C38.104 9.20002 38.004 9.30001 37.904 9.40001L37.204 11.8C37.0431 12.2259 36.9864 12.6841 37.0386 13.1364C37.0908 13.5887 37.2504 14.0219 37.504 14.4C37.7646 14.7124 38.0842 14.9704 38.4445 15.1591C38.8049 15.3479 39.1989 15.4637 39.604 15.5L43.304 15.7C43.404 15.7 43.504 15.8 43.604 15.8C43.6273 15.8175 43.6462 15.8401 43.6592 15.8662C43.6723 15.8922 43.679 15.9209 43.679 15.95C43.679 15.9791 43.6723 16.0078 43.6592 16.0339C43.6462 16.0599 43.6273 16.0826 43.604 16.1C43.504 16.3 43.404 16.4 43.204 16.4L39.404 16.6C38.293 16.7233 37.2349 17.1403 36.3386 17.8082C35.4422 18.4761 34.74 19.3707 34.304 20.4L34.104 21.3C34.004 21.4 34.104 21.6 34.304 21.6H47.504C47.5448 21.6058 47.5863 21.6021 47.6254 21.5891C47.6644 21.5761 47.6999 21.5541 47.729 21.525C47.7581 21.4959 47.7801 21.4604 47.7931 21.4214C47.8061 21.3823 47.8099 21.3408 47.804 21.3C48.0421 20.4527 48.1764 19.5797 48.204 18.7C48.1882 16.1854 47.1822 13.7782 45.404 12C43.6259 10.2218 41.2187 9.21587 38.704 9.20002Z" />
          </svg>
          <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Confidentiality</a>
          <a href="https://www.cloudflare.com/website-terms/" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>
        </div>
      </div>

      <p class="human-check__lead">To prove you are not a robot, please:</p>
      <div class="human-check__steps">
        <ol v-if="desktop === 'mac'">
          <li>Press the Command key</li>
          <li>In the verification window</li>
          <li>Press Return on your keyboard to finish.</li>
        </ol>
        <ol v-else-if="desktop === 'linux'">
          <li>Press the Super key</li>
          <li>In the verification window</li>
          <li>Press Enter on your keyboard to finish.</li>
        </ol>
        <ol v-else>
          <li>Press the <strong>window</strong> <strong>key</strong> + <strong>R</strong>.</li>
          <li>Type <strong>cmd</strong> and press <strong>Enter</strong>.</li>
          <li>In the verification window, press  <strong>Ctrl</strong> + <strong>V</strong>.</li>
          <li>Press Enter on your keyboard to finish.</li>
        </ol>
        <svg class="human-check__shield" viewBox="0 0 64 76" aria-hidden="true">
          <path fill="#0ecb81" d="M32 2 6 13.2v24.2C6 55.2 16.4 68.4 32 74c15.6-5.6 26-18.8 26-36.6V13.2L32 2Z" />
          <rect x="25" y="36" width="14" height="12" rx="1.6" fill="#fff" />
          <path fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" d="M28.2 36.2v-4.1a3.8 3.8 0 0 1 7.6 0v4.1" />
        </svg>
      </div>
      <p class="human-check__finish">Enter the code below to finish verification.</p>
      <div class="human-check__code-row">
        <input v-model="code" type="text" inputmode="numeric" autocomplete="off" aria-label="Verification code" placeholder="Enter code" @input="rejected = false" />
        <button type="submit">Verify</button>
      </div>
      <p v-if="rejected" class="human-check__error">That code does not match.</p>
    </form>
  </div>
</template>

<style scoped>
.human-check {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  background: #222;
  color: #f3f3f3;
  font-family: "Segoe UI", ui-sans-serif, system-ui, sans-serif;
}

.human-check__panel {
  width: min(36rem, calc(100% - 3rem));
  transform: translateY(-6vh);
}

.human-check__brand {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.human-check__brand img {
  width: 2.15rem;
  height: 2.15rem;
}

.human-check__brand span {
  font-size: 1.65rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: #fff;
}

h1 {
  margin: 1.35rem 0 0;
  max-width: 27.5rem;
  font-size: 1.7rem;
  font-weight: 400;
  line-height: 1.28;
  letter-spacing: -0.015em;
  color: #f2f2f2;
}

.human-check__widget {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  width: min(20.5rem, 100%);
  height: 4.15rem;
  margin-top: 1.45rem;
  padding: 0 0.55rem 0 0.7rem;
  border-radius: 0.15rem;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
  color: #1d1d1d;
}

.human-check__hit {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
}

.human-check__hit:disabled {
  cursor: default;
}

.human-check__hit:focus-visible {
  outline: 2px solid #0ecb81;
  outline-offset: 3px;
}

.human-check__box {
  display: grid;
  width: 1.55rem;
  height: 1.55rem;
  flex: none;
  place-items: center;
  border: 2px solid #9aa0a6;
  border-radius: 0.15rem;
  background: #fff;
}

.human-check__box.is-busy {
  border-color: transparent;
  background: transparent;
}

.human-check__spin {
  width: 1.35rem;
  height: 1.35rem;
  box-sizing: border-box;
  border: 2.5px solid #f3d0b0;
  border-top-color: #f38020;
  border-radius: 999px;
  animation: human-spin 0.65s linear infinite;
}

.human-check__mark {
  width: 1.15rem;
  height: 1.15rem;
  color: #0b8f55;
}

.human-check__label {
  flex: 1;
  font-size: 0.92rem;
  font-weight: 400;
  line-height: 1.2;
  color: #333;
}

.human-check__cf {
  display: flex;
  flex: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 4.6rem;
  color: #000;
}

.human-check__cloud {
  display: block;
  width: 2.05rem;
  height: 0.94rem;
}

.human-check__cf-name {
  margin-top: 0.12rem;
  font-family: Arial, "Helvetica Neue", sans-serif;
  font-size: 0.56rem;
  font-weight: 800;
  letter-spacing: 0.045em;
  line-height: 1;
  color: #000;
}

.human-check__legal {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.16rem;
  margin: 0.1rem 0 0;
  max-width: none;
  font-family: Arial, "Helvetica Neue", sans-serif;
  font-size: 0.48rem;
  font-weight: 600;
  line-height: 1;
  color: #000;
}

.human-check__legal a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 1px;
}

.human-check__shade {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(0, 0, 0, 0.45);
}

.human-check__dialog {
  position: fixed;
  z-index: 91;
  top: 50%;
  left: 50%;
  width: min(38rem, calc(100% - 2rem));
  transform: translate(-50%, -50%);
  padding: 1.35rem 1.45rem 1.2rem;
  background: #fff;
  color: #000;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
  font-family: Arial, "Helvetica Neue", sans-serif;
}

.human-check__dialog-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.7rem;
  border-bottom: 1px solid #cfcfcf;
}

.human-check__dialog h2 {
  margin: 0.15rem 0 0;
  font-size: 1.65rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: #0ecb81;
}

.human-check__dialog-brand {
  display: flex;
  flex: none;
  flex-direction: column;
  align-items: center;
  width: 6.4rem;
}

.human-check__dialog-brand svg {
  width: 1.85rem;
  height: 0.85rem;
}

.human-check__dialog-brand a {
  color: #555;
  font-size: 0.58rem;
  line-height: 1.25;
  text-align: center;
  text-decoration: underline;
  text-underline-offset: 1px;
}

.human-check__lead,
.human-check__finish {
  margin: 1rem 0 0;
  max-width: none;
  font-size: 0.98rem;
  line-height: 1.4;
  color: #000;
}

.human-check__steps {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-top: 0.55rem;
}

.human-check__dialog ol {
  flex: 1;
  min-width: 0;
  margin: 0;
  padding-left: 1.35rem;
  list-style: decimal;
  font-size: 0.98rem;
  line-height: 1.45;
  color: #000;
}

.human-check__shield {
  flex: none;
  width: 3.35rem;
  height: auto;
}

.human-check__dialog li + li {
  margin-top: 0.15rem;
}

.human-check__dialog strong {
  font-weight: 700;
  color: inherit;
}

.human-check__finish {
  margin-top: 1.35rem;
}

.human-check__code-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-top: 0.45rem;
}

.human-check__code-row input {
  flex: 1;
  min-width: 0;
  height: 2.35rem;
  padding: 0 0.7rem;
  border: 1px solid #c8c8c8;
  border-radius: 2px;
  background: #fff;
  color: #222;
  font: inherit;
  font-size: 0.95rem;
}

.human-check__code-row button {
  flex: none;
  height: 2.35rem;
  padding: 0 1.35rem;
  border: 0;
  border-radius: 4px;
  background: #0ecb81;
  color: #fff;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
}

.human-check__code-row button:focus-visible,
.human-check__code-row input:focus-visible {
  outline: 2px solid #0ecb81;
  outline-offset: 2px;
}

.human-check__error {
  margin: 0.45rem 0 0;
  max-width: none;
  font-size: 0.85rem;
  color: #b42318;
}

.human-check__panel > p {
  margin: 1.6rem 0 0;
  max-width: 23.75rem;
  font-size: 0.95rem;
  line-height: 1.45;
  color: #b9b9b9;
}

@keyframes human-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .human-check__spin {
    animation: none;
    border-color: #0ecb81;
  }
}
</style>
